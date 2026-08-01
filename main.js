'use strict';

/* -------------------------------------------------------------- utilities */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

/** addEventListener across several event types, firing at most once. */
function once(target, types, handler) {
    const wrapped = (event) => {
        types.forEach((type) => target.removeEventListener(type, wrapped));
        handler(event);
    };
    types.forEach((type) => target.addEventListener(type, wrapped));
}

/* ------------------------------------------------------------------ state */

let currentColor = '#000000';
let currentBg = '#ffffff';
let musicOn = false;
let pixels = [];

const selectedColorBox = $('#selectedColor');
const megaman = $('#megaman');
const playPauseButton = $('#playPause');
const undoButton = $('#undo');
const redoButton = $('#redo');
const volumeInput = $('#volume');

/* ------------------------------------------------------------------ audio */

const playlist = ['./files/1.mp3', './files/2.mp3', './files/3.mp3', './files/4.mp3'];
let playingSong = playlist[0];

const audio = $('#music');
const chargeSfx = $('#charge');
const oneUpSfx = $('#oneUp');
const energySfx = $('#energyAudio');

audio.volume = 0.2;
chargeSfx.volume = 0.7;

// Browsers block autoplay-with-sound until the user interacts with the page, so
// calling play() on load only downloaded ~2.7 MB that could never be heard. The
// audio elements are preload="none"; the first gesture both fetches and starts
// the track, which then streams as it buffers.
function tryPlayMusic() {
    audio.play()?.catch(() => {});
}
once(document, ['click', 'keydown'], tryPlayMusic);

/* ----------------------------------------------------------- undo history */

// An action stores only the cells it changed, mapped to the background they
// had beforehand — a 200-cell stroke costs 200 entries rather than a full
// snapshot of the grid. Cells are used as keys directly, so no index lookup.
const HISTORY_LIMIT = 50;
const undoStack = [];
const redoStack = [];
let pendingAction = null;

function beginAction() {
    pendingAction = new Map();
}

function recordPixel(cell) {
    if (pendingAction && !pendingAction.has(cell)) {
        pendingAction.set(cell, cell.style.background);
    }
}

function commitAction() {
    if (pendingAction?.size) {
        undoStack.push(pendingAction);
        if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
        redoStack.length = 0; // a fresh action abandons the redo branch
        refreshHistoryButtons();
    }
    pendingAction = null;
}

// Undo and redo are the same operation in opposite directions: restore the
// recorded backgrounds, and hand the values being replaced to the other stack
// so the step can be reversed again.
function stepHistory(from, to) {
    const action = from.pop();
    if (!action) return;

    const inverse = new Map();
    action.forEach((background, cell) => {
        inverse.set(cell, cell.style.background);
        cell.style.background = background;
    });

    to.push(inverse);
    refreshHistoryButtons();
}

const undo = () => stepHistory(undoStack, redoStack);
const redo = () => stepHistory(redoStack, undoStack);

function refreshHistoryButtons() {
    undoButton.disabled = undoStack.length === 0;
    redoButton.disabled = redoStack.length === 0;
}

/** Repaint every cell as a single undoable action. */
function fillAll(colour) {
    beginAction();
    pixels.forEach((cell) => {
        recordPixel(cell);
        cell.style.background = colour;
    });
    commitAction();
}

/* ---------------------------------------------------------------- drawing */

// Painting is driven by mousemove (which always fires during a drag) and
// interpolated along the stroke, so fast movements don't leave gaps. Touch and
// mouse share one path because paintAt hit-tests with elementFromPoint.
let isDrawing = false;
let lastX = null;
let lastY = null;

function paintAt(x, y) {
    const element = document.elementFromPoint(x, y);
    if (element?.classList.contains('pixel')) {
        recordPixel(element);
        element.style.background = currentColor;
    }
}

function paintLine(x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4)); // sample every ~4px
    for (let i = 0; i <= steps; i++) {
        paintAt(x0 + (dx * i) / steps, y0 + (dy * i) / steps);
    }
}

function pointOf(event) {
    const touch = event.touches?.[0];
    return touch
        ? { x: touch.clientX, y: touch.clientY }
        : { x: event.clientX, y: event.clientY };
}

function startStroke(event) {
    event.preventDefault(); // stop native image drag / page scroll while painting
    const { x, y } = pointOf(event);
    isDrawing = true;
    lastX = x;
    lastY = y;
    beginAction();
    paintAt(x, y);
}

function moveStroke(event) {
    if (!isDrawing) return;
    event.preventDefault();
    const { x, y } = pointOf(event);
    paintLine(lastX, lastY, x, y);
    lastX = x;
    lastY = y;
}

function endStroke() {
    if (!isDrawing) return;
    isDrawing = false;
    lastX = lastY = null;
    commitAction();
}

const pixelCanvas = $('#pixelCanvas');
// passive:false so preventDefault actually suppresses touch scrolling
pixelCanvas.addEventListener('mousedown', startStroke);
pixelCanvas.addEventListener('touchstart', startStroke, { passive: false });
pixelCanvas.addEventListener('mousemove', moveStroke);
pixelCanvas.addEventListener('touchmove', moveStroke, { passive: false });
['mouseup', 'touchend', 'touchcancel'].forEach((type) =>
    document.addEventListener(type, endStroke)
);

/* ------------------------------------------------------------------ grid */

// Dimensions are chosen for the viewport so pixels stay big enough to hit with
// a finger. Cells are sized with fr units in CSS, so the art scales fluidly
// afterwards (rotating a phone won't wipe it).
function gridSizeForViewport() {
    const width = window.innerWidth;
    if (width >= 900) return { cols: 58, rows: 38 }; // the classic desktop grid
    if (width >= 640) return { cols: 44, rows: 34 };
    return { cols: 32, rows: 36 };
}

function buildGrid() {
    const { cols, rows } = gridSizeForViewport();
    pixelCanvas.style.setProperty('--cols', cols);

    // build in a fragment: one reflow instead of ~2200
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
        const cell = document.createElement('div');
        cell.className = 'pixel';
        fragment.appendChild(cell);
    }
    pixelCanvas.appendChild(fragment);

    pixels = Array.from(pixelCanvas.children);
    undoStack.length = 0;
    redoStack.length = 0;
    refreshHistoryButtons();
}

/* ---------------------------------------------------------------- palette */

// One loop over the markup, rather than six near-identical handler pairs.
$$('.palette-row').forEach((row) => {
    const swatch = row.querySelector('.swatch');
    const setButton = row.querySelector('button');

    setButton.addEventListener('click', () => {
        swatch.style.background = currentColor;
    });
    swatch.addEventListener('click', () => {
        currentColor = getComputedStyle(swatch).backgroundColor;
        selectedColorBox.style.background = currentColor;
    });
});

/* ------------------------------------------------------------------ music */

function setMega(src, width) {
    megaman.setAttribute('src', src);
    megaman.style.width = `${width}px`;
    megaman.style.height = '92px';
}

// The audio element is the source of truth — autoplay can be blocked and a
// track can end on its own, so the button label is derived from it rather than
// tracked separately. Called on click too: .paused flips synchronously but the
// play/pause events don't, so the label would otherwise lag a tick.
function syncPlayButton() {
    const playing = !audio.paused;
    musicOn = playing;
    playPauseButton.textContent = playing ? '❚❚' : '▶';
    playPauseButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
audio.addEventListener('play', syncPlayButton);
audio.addEventListener('pause', syncPlayButton);

playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        tryPlayMusic();
        megaman.setAttribute('src', './img/megaman.gif');
    } else {
        audio.pause();
        megaman.setAttribute('src', './img/mega-default.png');
    }
    syncPlayButton();
});

volumeInput.addEventListener('input', (event) => {
    audio.volume = Math.min(1, Math.max(0, event.target.value / 100));
});

// Next/previous share one implementation instead of two mirrored if-chains.
// Note the audio element needs .load() after the src changes, otherwise the
// new track is never actually picked up.
function changeTrack(delta) {
    const current = megaman.getAttribute('src');
    megaman.setAttribute(
        'src',
        current.includes('megaman.gif') ? './img/mega-dance.gif' : './img/megaman.gif'
    );

    const index = Math.max(0, playlist.indexOf(playingSong));
    playingSong = playlist[(index + delta + playlist.length) % playlist.length];

    audio.setAttribute('src', playingSong);
    audio.load();
    audio.volume = Math.min(1, Math.max(0, volumeInput.value / 100));
    tryPlayMusic();
}
$('#nextTrack').addEventListener('click', () => changeTrack(1));
$('#previousTrack').addEventListener('click', () => changeTrack(-1));

/* ------------------------------------------------------------------ tools */

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

document.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key?.toLowerCase();

    // Ctrl/Cmd+Z undoes, Shift makes it a redo; Ctrl+Y redoes too (Windows).
    if (key === 'z') {
        event.preventDefault();
        (event.shiftKey ? redo : undo)();
    } else if (key === 'y') {
        event.preventDefault();
        redo();
    }
});

$('#erase').addEventListener('click', () => {
    // "Erase" paints with the current background colour so squares blend back in
    currentColor = currentBg;
    selectedColorBox.style.background = currentBg;
});

$('#colorPicker').addEventListener('change', (event) => {
    currentColor = event.target.value;
    selectedColorBox.style.background = currentColor;
});

$('#eraseAll').addEventListener('click', () => {
    chargeSfx.play();

    // Whichever sprite MegaMan is wearing, he charges, fires, then goes back to
    // it. The blast itself always happens — an older version only cleared the
    // canvas when the sprite matched one of two exact filenames.
    const current = megaman.getAttribute('src');
    const restoreTo = !musicOn
        ? './img/mega-default.png'
        : current.includes('mega-dance')
            ? './img/mega-dance.gif'
            : './img/megaman.gif';

    setMega('./img/charge.gif', 80);
    setTimeout(() => {
        setMega('./img/mega-shoot.png', 105);
        fillAll(currentBg);
    }, 2700);
    setTimeout(() => setMega(restoreTo, 77), 4000);
});

$('#bgColor').addEventListener('change', (event) => {
    currentBg = event.target.value;
    fillAll(currentBg);
});

$('#gridColor').addEventListener('change', (event) => {
    pixels.forEach((cell) => {
        cell.style.borderColor = event.target.value;
    });
});

/* ------------------------------------------------------------------- save */

// html2canvas is ~160 KB and only ever needed once someone saves, so it is
// fetched on the first click instead of on every page load.
function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve();
    loadHtml2Canvas.pending ??= new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = './files/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = () => {
            loadHtml2Canvas.pending = null;
            reject();
        };
        document.head.appendChild(script);
    });
    return loadHtml2Canvas.pending;
}

$('#disk').addEventListener('click', () => {
    loadHtml2Canvas()
        .then(() => html2canvas($('#capture')))
        .then((canvas) => {
            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.download = 'pixelator-art.png';
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            });

            Swal.fire('Masterpiece Saved!', 'Your art was downloaded as pixelator-art.png.', 'success');
        })
        .catch(() => {
            Swal.fire(
                'Could not save',
                'The image library failed to load. Check your connection and try again.',
                'error'
            );
        });
});

/* ------------------------------------------------------------ easter eggs */

$('#energy').addEventListener('click', () => {
    energySfx.play();
    $('#hidden-mega').style.display = 'block';
    $('#hidden-text').style.display = 'block';
});

$('#hidden-mega').addEventListener('click', () => {
    oneUpSfx.play();
    $('#mega-life').style.display = 'block';
    Swal.fire(
        'Congrats!',
        'You found the hidden MegaMan! you deserve a 1-Up! Check upper left corner. ' +
            'This token is a proof that you found the hidden MegaMan',
        'success'
    );
});

/* ------------------------------------------------------------ main screen */

$('#startButton').addEventListener('click', () => {
    $('.canvas h3').remove();
    $('#startButton').remove();
    $('#instructions').remove();
    $('.canvas').classList.remove('flex');
    buildGrid();
});

$('#instructions').addEventListener('click', () => {
    Swal.fire({
        title: 'Instructions',
        text:
            'Create your pixel art masterpiece using tools on the left and right panels ' +
            'of the screen! There is a hidden MegaMan in the screen, try to find him! ' +
            '(No, not the one on the left side :p)',
        confirmButtonText: 'Okay',
    });
});

/* ------------------------------------------------------------------- init */

selectedColorBox.style.background = currentColor;
refreshHistoryButtons();
