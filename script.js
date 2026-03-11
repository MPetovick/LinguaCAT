/*!
 * HUSHBOX v3.9.2 - PROFESSIONAL EDITION (solo tema oscuro, optimizado)
 */

// ==================== CONFIG ====================
const CONFIG = {
    PBKDF2_ITERATIONS: 310000,
    SALT_LENGTH: 32,
    IV_LENGTH: 16,
    AES_KEY_LENGTH: 256,
    HMAC_KEY_LENGTH: 256,
    HMAC_LENGTH: 32,
    QR_SIZE: 200,
    MIN_PASSPHRASE_LENGTH: 12,
    MAX_MESSAGE_LENGTH: 10000,
    CAMERA_TIMEOUT: 30000,
    MAX_DECRYPT_ATTEMPTS: 5,
    NOTICE_TIMEOUT: 5000,
    SESSION_TIMEOUT: 1800000,
    QR_ERROR_CORRECTION: 'H',
    RATE_LIMIT_BASE_DELAY: 1000,
    RATE_LIMIT_MAX_DELAY: 30000,
    MAX_CHUNK_SIZE: 1800,
    FILE_CHUNK_PREFIX: 'HBX:v1:',
    SCAN_FRAME_SKIP: 1,
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    VERSION: 'HBXv1',
    MAX_LOG_ENTRIES: 100,
    MAX_CACHED_KEYS: 50
};

const DEFAULT_CONFIG = {
    PBKDF2_ITERATIONS: 310000,
    SECURITY_LEVEL: 'high',
    SESSION_TIMEOUT: 30,
    QR_ERROR_CORRECTION: 'H'
};

// ==================== STATE ====================
const appState = {
    isEncrypting: false,
    isDecrypting: false,
    sessionActive: true,
    lastEncryptedData: null,
    decryptAttempts: 0,
    lastDecryptAttempt: 0,
    securityLevel: 'high',
    camera: null,
    fileTransferInstance: null,
    fileTransferMessageInstance: null,
    currentFile: null,
    currentFileMessage: null,
    cachedKeys: new Map(),
    lastActivity: Date.now(),
    tutorialStep: 1,
    currentObjectUrls: [],
    messagePanelMode: 'message'
};

// ==================== DOM ====================
const dom = {
    get: id => document.getElementById(id),
    qs: sel => document.querySelector(sel),
    qsa: sel => document.querySelectorAll(sel),

    encryptForm: document.getElementById('encrypt-form'),
    passphrase: document.getElementById('passphrase'),
    messageInput: document.getElementById('message-input'),
    sendButton: document.getElementById('send-button'),
    scanButtonText: document.getElementById('scan-button-text'),
    pasteQrButton: document.getElementById('paste-qr-button'),
    charCounter: document.getElementById('char-counter'),
    passwordStrengthBar: document.getElementById('password-strength-bar'),
    passphraseError: document.getElementById('passphrase-error'),

    panelMessage: document.getElementById('panel-message'),
    panelFile: document.getElementById('panel-file'),

    fileDropZone: document.getElementById('file-drop-zone'),
    fileInput: document.getElementById('file-input'),
    selectFileButton: document.getElementById('select-file-button'),
    fileInfo: document.getElementById('file-info'),
    fileName: document.getElementById('file-name'),
    fileSize: document.getElementById('file-size'),
    clearFile: document.getElementById('clear-file'),
    filePassphrase: document.getElementById('file-passphrase'),
    qrFormat: document.getElementById('qr-format'),
    matrixColsGroup: document.getElementById('matrix-cols-group'),
    matrixCols: document.getElementById('matrix-cols'),
    chunkSize: document.getElementById('chunk-size'),
    progressArea: document.getElementById('progress-area'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    generateFileQr: document.getElementById('generate-file-qr'),
    scanFileQr: document.getElementById('scan-file-qr'),
    uploadMatrixBtn: document.getElementById('upload-matrix-btn'),
    fileOutputArea: document.getElementById('file-output-area'),
    downloadGifLink: document.getElementById('download-gif-link'),
    downloadPngLink: document.getElementById('download-png-link'),
    downloadReconstructedLink: document.getElementById('download-reconstructed-link'),

    messages: document.getElementById('messages'),
    clearLog: document.getElementById('clear-log'),

    moreMenu: document.getElementById('more-menu'),
    dropdown: document.querySelector('.dropdown'),
    settingsButton: document.getElementById('settings-button'),
    securityLevelIndicator: document.getElementById('security-level-indicator'),
    sessionTime: document.getElementById('session-time'),

    cameraModal: document.getElementById('camera-modal'),
    cameraPreview: document.getElementById('camera-preview'),
    closeCamera: document.getElementById('close-camera'),
    detectionBox: document.getElementById('detection-box'),
    cameraHint: document.getElementById('camera-hint'),

    settingsModal: document.getElementById('settings-modal'),
    saveSettings: document.getElementById('save-settings'),
    resetSettings: document.getElementById('reset-settings'),
    cancelSettings: document.getElementById('cancel-settings'),
    pbkdf2IterationsInput: document.getElementById('pbkdf2-iterations'),
    securityLevelSelect: document.getElementById('security-level'),
    sessionTimeoutInput: document.getElementById('session-timeout'),
    qrErrorCorrectionSelect: document.getElementById('qr-error-correction'),

    tutorialModal: document.getElementById('tutorial-modal'),
    closeTutorial: document.getElementById('close-tutorial'),
    tutorialPrev: document.getElementById('tutorial-prev'),
    tutorialNext: document.getElementById('tutorial-next'),
    tutorialDone: document.getElementById('tutorial-done'),
    tutorialCounter: document.getElementById('tutorial-counter'),
    tutorialSteps: {
        1: document.getElementById('tutorial-step-1'),
        2: document.getElementById('tutorial-step-2'),
        3: document.getElementById('tutorial-step-3'),
        4: document.getElementById('tutorial-step-4'),
        5: document.getElementById('tutorial-step-5'),
    },
    dontShowTutorial: document.getElementById('dont-show-tutorial'),

    uploadQrFile: document.getElementById('upload-qr-file'),
    toastContainer: document.getElementById('toast-container'),

    qrModal: document.getElementById('qr-modal'),
    closeQrModal: document.getElementById('close-qr-modal'),
    qrModalTitle: document.getElementById('qr-modal-title-text'),
    qrModalDisplay: document.getElementById('qr-modal-display'),
    qrModalActions: document.getElementById('qr-modal-actions'),

    decryptedModal: document.getElementById('decrypted-message-modal'),
    decryptedText: document.getElementById('decrypted-message-text'),
    copyDecryptedBtn: document.getElementById('copy-decrypted-btn'),
    closeDecryptedBtn: document.getElementById('close-decrypted-btn'),

    messageMode: document.getElementById('message-mode'),
    fileMode: document.getElementById('file-mode'),
    uploadFileButton: document.getElementById('upload-file-button'),
    uploadQrButton: document.getElementById('upload-qr-button'),
    backToMessage: document.getElementById('back-to-message'),

    filePassphraseMessage: document.getElementById('file-passphrase-message'),
    fileDropZoneMessage: document.getElementById('file-drop-zone-message'),
    fileInputMessage: document.getElementById('file-input-message'),
    selectFileButtonMessage: document.getElementById('select-file-button-message'),
    fileInfoMessage: document.getElementById('file-info-message'),
    fileNameMessage: document.getElementById('file-name-message'),
    fileSizeMessage: document.getElementById('file-size-message'),
    clearFileMessage: document.getElementById('clear-file-message'),
    qrFormatMessage: document.getElementById('qr-format-message'),
    matrixColsGroupMessage: document.getElementById('matrix-cols-group-message'),
    matrixColsMessage: document.getElementById('matrix-cols-message'),
    chunkSizeMessage: document.getElementById('chunk-size-message'),
    generateFileQrMessage: document.getElementById('generate-file-qr-message'),
    scanFileQrMessage: document.getElementById('scan-file-qr-message'),
    uploadMatrixBtnMessage: document.getElementById('upload-matrix-btn-message'),
    progressAreaMessage: document.getElementById('progress-area-message'),
    progressFillMessage: document.getElementById('progress-fill-message'),
    progressTextMessage: document.getElementById('progress-text-message'),
    fileOutputAreaMessage: document.getElementById('file-output-area-message'),
    downloadGifLinkMessage: document.getElementById('download-gif-link-message'),
    downloadPngLinkMessage: document.getElementById('download-png-link-message'),
    downloadReconstructedLinkMessage: document.getElementById('download-reconstructed-link-message')
};

// ==================== UTILIDADES DE SEGURIDAD ====================
const securityUtils = {
    sanitizeHTML: (str) => {
        if (typeof str !== 'string') return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
        return str.replace(/[&<>"'/]/g, c => map[c]).slice(0, CONFIG.MAX_MESSAGE_LENGTH * 2);
    },

    validateInput: (input, type) => {
        if (typeof input !== 'string') throw new Error(`Invalid ${type}`);
        const c = {
            passphrase: { min: CONFIG.MIN_PASSPHRASE_LENGTH, max: 256, pattern: /^[\x20-\x7E]+$/ },
            message: { min: 1, max: CONFIG.MAX_MESSAGE_LENGTH, pattern: /^[\s\S]*$/ }
        }[type];
        if (!c) throw new Error('Unknown type');
        if (input.length < c.min) throw new Error(`${type} too short`);
        if (input.length > c.max) throw new Error(`${type} too long`);
        if (c.pattern && !c.pattern.test(input)) throw new Error(`Invalid characters in ${type}`);
        return true;
    },

    checkRateLimit: () => {
        const now = Date.now();
        if (now - appState.lastDecryptAttempt > 300000) {
            appState.decryptAttempts = 0;
            appState.rateLimitDelay = 0;
        }
        if (appState.decryptAttempts > 0) {
            appState.rateLimitDelay = Math.min(
                CONFIG.RATE_LIMIT_BASE_DELAY * Math.pow(2, appState.decryptAttempts - 1),
                CONFIG.RATE_LIMIT_MAX_DELAY
            );
            if (now - appState.lastDecryptAttempt < appState.rateLimitDelay) {
                const remaining = Math.ceil((appState.rateLimitDelay - (now - appState.lastDecryptAttempt)) / 1000);
                throw new Error(`Too many attempts. Wait ${remaining}s.`);
            }
        }
        if (appState.decryptAttempts >= CONFIG.MAX_DECRYPT_ATTEMPTS) throw new Error('Max attempts reached.');
        appState.lastDecryptAttempt = now;
    },

    incrementAttempts: () => { appState.decryptAttempts++; appState.lastDecryptAttempt = Date.now(); },
    resetRateLimit: () => { appState.decryptAttempts = 0; appState.rateLimitDelay = 0; appState.lastDecryptAttempt = 0; },

    revokeObjectUrl: (url) => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
    },
    revokeAllObjectUrls: () => {
        appState.currentObjectUrls.forEach(url => securityUtils.revokeObjectUrl(url));
        appState.currentObjectUrls = [];
    },
    registerObjectUrl: (url) => {
        appState.currentObjectUrls.push(url);
        return url;
    }
};

// ==================== CRYPTO ====================
const cryptoUtils = {
    encodeHeader: (iterations, keyLengthBits, hmacFlag) => {
        return `${CONFIG.VERSION}|${iterations}|${keyLengthBits}|${hmacFlag ? 1 : 0}|`;
    },

    decodeHeader: (str) => {
        const parts = str.split('|');
        if (parts.length < 5 || parts[0] !== CONFIG.VERSION) throw new Error('Invalid header');
        return {
            version: parts[0],
            iterations: parseInt(parts[1]),
            keyLengthBits: parseInt(parts[2]),
            hmacFlag: parts[3] === '1'
        };
    },

    validatePassphrase: (pass, strict = true) => {
        securityUtils.validateInput(pass, 'passphrase');
        if (strict) {
            const common = ['password','123456','qwerty','letmein'];
            if (common.includes(pass.toLowerCase())) throw new Error('Password too common');
            const hasUpper = /[A-Z]/.test(pass), hasLower = /[a-z]/.test(pass), hasNumber = /[0-9]/.test(pass), hasSymbol = /[^A-Za-z0-9]/.test(pass);
            if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) throw new Error('Password must include uppercase, lowercase, number, symbol');
            if (new Set(pass).size < CONFIG.MIN_PASSPHRASE_LENGTH * 0.7) throw new Error('Too many repeated characters');
        }
        return true;
    },

    calculatePasswordStrength: (pass) => {
        if (!pass) return 0;
        let score = Math.min(pass.length * 4, 40);
        if (/[A-Z]/.test(pass)) score += 10;
        if (/[a-z]/.test(pass)) score += 10;
        if (/[0-9]/.test(pass)) score += 10;
        if (/[^A-Za-z0-9]/.test(pass)) score += 15;
        if (/(.)\1{2,}/.test(pass)) score -= 15;
        return Math.min(100, Math.max(0, score));
    },

    generateSecurePass: (length = 16) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
        const values = new Uint32Array(length);
        crypto.getRandomValues(values);
        let pass = Array.from(values, v => chars[v % chars.length]).join('');
        if (!/[A-Z]/.test(pass)) pass = 'A' + pass.slice(1);
        if (!/[a-z]/.test(pass)) pass = pass.slice(0, -1) + 'a';
        if (!/[0-9]/.test(pass)) pass = pass.slice(0, -1) + '1';
        if (!/[^A-Za-z0-9]/.test(pass)) pass = pass.slice(0, -1) + '!';
        return pass;
    },

    deriveKeys: async (passphrase, salt, iterations, keyLengthBits, useHmac) => {
        const cacheKey = `${passphrase}-${Array.from(salt).join(',')}-${iterations}-${keyLengthBits}-${useHmac}`;
        if (appState.cachedKeys.has(cacheKey)) return appState.cachedKeys.get(cacheKey);
        if (appState.cachedKeys.size >= CONFIG.MAX_CACHED_KEYS) {
            const firstKey = appState.cachedKeys.keys().next().value;
            appState.cachedKeys.delete(firstKey);
        }

        const enc = new TextEncoder();
        const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveBits']);
        const totalBits = keyLengthBits + (useHmac ? CONFIG.HMAC_KEY_LENGTH : 0);
        const derived = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
            baseKey,
            totalBits
        );
        const arr = new Uint8Array(derived);
        const aesKeyBytes = arr.slice(0, keyLengthBits / 8);
        const aesKey = await crypto.subtle.importKey('raw', aesKeyBytes, { name: 'AES-GCM' }, false, ['encrypt','decrypt']);
        let hmacKey = null;
        if (useHmac) {
            const hmacKeyBytes = arr.slice(keyLengthBits / 8);
            hmacKey = await crypto.subtle.importKey('raw', hmacKeyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign','verify']);
        }
        const keys = { aesKey, hmacKey, useHmac };
        appState.cachedKeys.set(cacheKey, keys);
        return keys;
    },

    encryptMessage: async (message, passphrase) => {
        securityUtils.validateInput(message, 'message');
        cryptoUtils.validatePassphrase(passphrase, true);

        let keyLengthBits, useHmac;
        switch (appState.securityLevel) {
            case 'high': keyLengthBits = 256; useHmac = true; break;
            case 'medium': keyLengthBits = 256; useHmac = false; break;
            case 'low': keyLengthBits = 128; useHmac = false; break;
            default: keyLengthBits = 256; useHmac = true;
        }

        let data = new TextEncoder().encode(message);
        if (message.length > 100 && window.pako) data = pako.deflate(data);

        const salt = crypto.getRandomValues(new Uint8Array(CONFIG.SALT_LENGTH));
        const iv = crypto.getRandomValues(new Uint8Array(CONFIG.IV_LENGTH));
        const iterations = CONFIG.PBKDF2_ITERATIONS;

        const { aesKey, hmacKey } = await cryptoUtils.deriveKeys(passphrase, salt, iterations, keyLengthBits, useHmac);

        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);
        const ciphertext = new Uint8Array(encrypted);

        let combined;
        if (useHmac) {
            const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, ciphertext));
            combined = new Uint8Array([...salt, ...iv, ...ciphertext, ...hmac]);
        } else {
            combined = new Uint8Array([...salt, ...iv, ...ciphertext]);
        }

        const header = cryptoUtils.encodeHeader(iterations, keyLengthBits, useHmac);
        const headerBytes = new TextEncoder().encode(header);
        const final = new Uint8Array(headerBytes.length + combined.length);
        final.set(headerBytes);
        final.set(combined, headerBytes.length);

        return btoa(String.fromCharCode(...final));
    },

    decryptMessage: async (encryptedBase64, passphrase) => {
        securityUtils.checkRateLimit();
        if (!encryptedBase64 || !passphrase) throw new Error('Missing data');

        const raw = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

        let headerEnd = 0, pipeCount = 0;
        while (headerEnd < raw.length && pipeCount < 4) {
            if (raw[headerEnd] === 124) pipeCount++;
            headerEnd++;
        }
        if (pipeCount < 4) throw new Error('Invalid header');
        const headerStr = new TextDecoder().decode(raw.slice(0, headerEnd));
        const header = cryptoUtils.decodeHeader(headerStr);

        const body = raw.slice(headerEnd);
        const minLen = CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH + (header.hmacFlag ? CONFIG.HMAC_LENGTH : 0);
        if (body.length < minLen) throw new Error('Invalid data');

        const salt = body.slice(0, CONFIG.SALT_LENGTH);
        const iv = body.slice(CONFIG.SALT_LENGTH, CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH);
        const ciphertext = body.slice(CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH, header.hmacFlag ? -CONFIG.HMAC_LENGTH : undefined);
        const hmac = header.hmacFlag ? body.slice(-CONFIG.HMAC_LENGTH) : null;

        const { aesKey, hmacKey } = await cryptoUtils.deriveKeys(passphrase, salt, header.iterations, header.keyLengthBits, header.hmacFlag);

        if (header.hmacFlag) {
            const isValid = await crypto.subtle.verify('HMAC', hmacKey, hmac, ciphertext);
            if (!isValid) { securityUtils.incrementAttempts(); throw new Error('Integrity check failed'); }
        }

        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);
        let result = new Uint8Array(decrypted);
        if (window.pako) try { result = pako.inflate(result); } catch {}

        securityUtils.resetRateLimit();
        return new TextDecoder().decode(result);
    },

    encryptData: async (data, passphrase) => {
        let keyLengthBits, useHmac;
        switch (appState.securityLevel) {
            case 'high': keyLengthBits = 256; useHmac = true; break;
            case 'medium': keyLengthBits = 256; useHmac = false; break;
            case 'low': keyLengthBits = 128; useHmac = false; break;
            default: keyLengthBits = 256; useHmac = true;
        }

        const salt = crypto.getRandomValues(new Uint8Array(CONFIG.SALT_LENGTH));
        const iv = crypto.getRandomValues(new Uint8Array(CONFIG.IV_LENGTH));
        const iterations = CONFIG.PBKDF2_ITERATIONS;

        const { aesKey, hmacKey } = await cryptoUtils.deriveKeys(passphrase, salt, iterations, keyLengthBits, useHmac);

        const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);
        const ciphertext = new Uint8Array(encrypted);

        let combined;
        if (useHmac) {
            const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, ciphertext));
            combined = new Uint8Array([...salt, ...iv, ...ciphertext, ...hmac]);
        } else {
            combined = new Uint8Array([...salt, ...iv, ...ciphertext]);
        }

        const header = cryptoUtils.encodeHeader(iterations, keyLengthBits, useHmac);
        const headerBytes = new TextEncoder().encode(header);
        const final = new Uint8Array(headerBytes.length + combined.length);
        final.set(headerBytes);
        final.set(combined, headerBytes.length);

        return btoa(String.fromCharCode(...final));
    },

    decryptData: async (encryptedBase64, passphrase) => {
        securityUtils.checkRateLimit();
        const raw = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

        let headerEnd = 0, pipeCount = 0;
        while (headerEnd < raw.length && pipeCount < 4) {
            if (raw[headerEnd] === 124) pipeCount++;
            headerEnd++;
        }
        if (pipeCount < 4) throw new Error('Invalid header');
        const headerStr = new TextDecoder().decode(raw.slice(0, headerEnd));
        const header = cryptoUtils.decodeHeader(headerStr);

        const body = raw.slice(headerEnd);
        const minLen = CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH + (header.hmacFlag ? CONFIG.HMAC_LENGTH : 0);
        if (body.length < minLen) throw new Error('Invalid data');

        const salt = body.slice(0, CONFIG.SALT_LENGTH);
        const iv = body.slice(CONFIG.SALT_LENGTH, CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH);
        const ciphertext = body.slice(CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH, header.hmacFlag ? -CONFIG.HMAC_LENGTH : undefined);
        const hmac = header.hmacFlag ? body.slice(-CONFIG.HMAC_LENGTH) : null;

        const { aesKey, hmacKey } = await cryptoUtils.deriveKeys(passphrase, salt, header.iterations, header.keyLengthBits, header.hmacFlag);

        if (header.hmacFlag) {
            const isValid = await crypto.subtle.verify('HMAC', hmacKey, hmac, ciphertext);
            if (!isValid) { securityUtils.incrementAttempts(); throw new Error('Integrity check failed'); }
        }

        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);
        securityUtils.resetRateLimit();
        return new Uint8Array(decrypted);
    }
};

// ==================== FILE TRANSFER CLASS ====================
class FileTransfer {
    constructor(target = 'main') {
        this.target = target;
        this.chunks = [];
        this.fileName = '';
        this.totalChunks = 0;
        this.scannedChunks = new Map();
        this.metadata = null;
        this.passphrase = '';

        if (target === 'message') {
            this.fileDropZone = dom.fileDropZoneMessage;
            this.fileInput = dom.fileInputMessage;
            this.fileInfo = dom.fileInfoMessage;
            this.fileNameEl = dom.fileNameMessage;
            this.fileSizeEl = dom.fileSizeMessage;
            this.clearFileBtn = dom.clearFileMessage;
            this.qrFormat = dom.qrFormatMessage;
            this.matrixColsGroup = dom.matrixColsGroupMessage;
            this.matrixCols = dom.matrixColsMessage;
            this.chunkSize = dom.chunkSizeMessage;
            this.progressArea = dom.progressAreaMessage;
            this.progressFill = dom.progressFillMessage;
            this.progressText = dom.progressTextMessage;
            this.generateBtn = dom.generateFileQrMessage;
            this.scanBtn = dom.scanFileQrMessage;
            this.uploadMatrixBtn = dom.uploadMatrixBtnMessage;
            this.fileOutputArea = dom.fileOutputAreaMessage;
            this.downloadGifLink = dom.downloadGifLinkMessage;
            this.downloadPngLink = dom.downloadPngLinkMessage;
            this.downloadReconstructedLink = dom.downloadReconstructedLinkMessage;
        } else {
            this.fileDropZone = dom.fileDropZone;
            this.fileInput = dom.fileInput;
            this.fileInfo = dom.fileInfo;
            this.fileNameEl = dom.fileName;
            this.fileSizeEl = dom.fileSize;
            this.clearFileBtn = dom.clearFile;
            this.qrFormat = dom.qrFormat;
            this.matrixColsGroup = dom.matrixColsGroup;
            this.matrixCols = dom.matrixCols;
            this.chunkSize = dom.chunkSize;
            this.progressArea = dom.progressArea;
            this.progressFill = dom.progressFill;
            this.progressText = dom.progressText;
            this.generateBtn = dom.generateFileQr;
            this.scanBtn = dom.scanFileQr;
            this.uploadMatrixBtn = dom.uploadMatrixBtn;
            this.fileOutputArea = dom.fileOutputArea;
            this.downloadGifLink = dom.downloadGifLink;
            this.downloadPngLink = dom.downloadPngLink;
            this.downloadReconstructedLink = dom.downloadReconstructedLink;
        }
    }

    setPassphrase(pass) { this.passphrase = pass; }

    async prepareFile(file, chunkSize, passphrase) {
        ui.log(`Preparing: ${file.name}`);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    let data = new Uint8Array(e.target.result);
                    const compressed = pako.deflate(data);
                    ui.log(`Compressed: ${data.length} → ${compressed.length} bytes`);
                    const encryptedBase64 = await cryptoUtils.encryptData(compressed, passphrase);
                    this.totalChunks = Math.ceil(encryptedBase64.length / chunkSize);
                    this.fileName = file.name;
                    this.chunks = [];
                    for (let i = 0; i < this.totalChunks; i++) {
                        const chunkData = encryptedBase64.substring(i * chunkSize, (i + 1) * chunkSize);
                        const header = `${CONFIG.FILE_CHUNK_PREFIX}${file.name}|${this.totalChunks}|${i}|`;
                        this.chunks.push(header + chunkData);
                    }
                    resolve({ chunks: this.chunks, fileName: this.fileName, totalChunks: this.totalChunks, originalSize: file.size });
                } catch (err) { reject(err); }
            };
            reader.readAsArrayBuffer(file);
        });
    }

    async generateOutput(format, matrixCols = 3) {
        if (!this.chunks.length) throw new Error('No chunks');
        if (format === 'gif' && this.chunks.length === 1) {
            ui.log('Only one QR code generated. Switching to PNG format.');
            format = 'png-matrix';
        }

        ui.showProgress(0, this.chunks.length, this.progressArea, this.progressFill, this.progressText);
        securityUtils.revokeAllObjectUrls();

        if (format === 'gif') {
            const gif = new GIF({ 
                workers: 2, 
                quality: 10, 
                width: 200, 
                height: 200,
                workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js'
            });

            for (let i = 0; i < this.chunks.length; i++) {
                await new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 200; canvas.height = 200;
                    QRCode.toCanvas(canvas, this.chunks[i], { width: 200, margin: 1, errorCorrectionLevel: 'H' }, () => {
                        gif.addFrame(canvas, { delay: 500 });
                        ui.updateProgress(i + 1, this.chunks.length, this.progressFill, this.progressText);
                        resolve();
                    });
                });
            }

            gif.on('finished', (blob) => {
                const url = securityUtils.registerObjectUrl(URL.createObjectURL(blob));
                this.downloadGifLink.href = url;
                this.downloadGifLink.classList.remove('hidden');
                this.fileOutputArea.classList.remove('hidden');
                ui.hideProgress(this.progressArea);
                ui.log('GIF ready');
                ui.showToast('GIF generated successfully', 'success');
                ui.showQRModal('gif', blob);
            });
            gif.render();
        } else {
            const cols = Math.min(matrixCols, 10);
            const rows = Math.ceil(this.chunks.length / cols);
            const qrSize = 200;
            const canvas = document.createElement('canvas');
            canvas.width = cols * qrSize;
            canvas.height = rows * qrSize;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < this.chunks.length; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = qrSize; qrCanvas.height = qrSize;
                await new Promise(resolve => {
                    QRCode.toCanvas(qrCanvas, this.chunks[i], { width: qrSize, margin: 1, errorCorrectionLevel: 'H' }, () => {
                        ctx.drawImage(qrCanvas, col * qrSize, row * qrSize, qrSize, qrSize);
                        ui.updateProgress(i + 1, this.chunks.length, this.progressFill, this.progressText);
                        resolve();
                    });
                });
            }

            canvas.toBlob((blob) => {
                const url = securityUtils.registerObjectUrl(URL.createObjectURL(blob));
                this.downloadPngLink.href = url;
                this.downloadPngLink.classList.remove('hidden');
                this.fileOutputArea.classList.remove('hidden');
                ui.hideProgress(this.progressArea);
                ui.log('PNG matrix ready');
                ui.showToast('PNG matrix generated', 'success');
                ui.showQRModal('png', blob);
            }, 'image/png');
        }
    }

    processChunk(text) {
        if (!text.startsWith(CONFIG.FILE_CHUNK_PREFIX)) return false;
        const parts = text.split('|');
        if (parts.length < 4) return false;
        const fileName = parts[1];
        const total = parseInt(parts[2]);
        const index = parseInt(parts[3]);
        const data = parts.slice(4).join('|');
        if (!this.metadata || this.metadata.fileName !== fileName) {
            this.metadata = { fileName, total };
            this.scannedChunks.clear();
            ui.showProgress(0, total, this.progressArea, this.progressFill, this.progressText);
        }
        if (!this.scannedChunks.has(index)) {
            this.scannedChunks.set(index, data);
            ui.log(`Chunk ${index+1}/${total}`);
            ui.updateProgress(this.scannedChunks.size, total, this.progressFill, this.progressText);
        }
        if (this.scannedChunks.size === total) {
            this.reconstructFile().catch(err => {
                ui.log('Reconstruction error: ' + err.message);
                ui.showToast('Reconstruction failed', 'error');
            });
        }
        return true;
    }

    async reconstructFile() {
        if (!this.metadata) return;
        if (!this.passphrase) throw new Error('Passphrase not set for decryption');
        let base64 = '';
        for (let i = 0; i < this.metadata.total; i++) base64 += this.scannedChunks.get(i);
        try {
            const decryptedData = await cryptoUtils.decryptData(base64, this.passphrase);
            const decompressed = pako.inflate(decryptedData);
            const blob = new Blob([decompressed]);
            const url = securityUtils.registerObjectUrl(URL.createObjectURL(blob));
            this.downloadReconstructedLink.href = url;
            this.downloadReconstructedLink.download = this.metadata.fileName;
            this.downloadReconstructedLink.classList.remove('hidden');
            this.fileOutputArea.classList.remove('hidden');
            ui.log('Reconstruction complete');
            ui.hideProgress(this.progressArea);
            ui.showToast('File reconstructed', 'success');
        } catch (e) {
            ui.log('Reconstruction error: ' + e.message);
            ui.showToast('Decryption failed: ' + e.message, 'error');
        }
        setTimeout(() => { this.scannedChunks.clear(); this.metadata = null; }, 30000);
    }

    async decodeFromPNGMatrix(file, cols) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                const cellSize = img.width / cols;
                let row = 0;
                const scanRow = () => {
                    for (let c = 0; c < cols; c++) {
                        const x = c * cellSize;
                        const y = row * cellSize;
                        if (y + cellSize > img.height) continue;
                        const cellCanvas = document.createElement('canvas');
                        cellCanvas.width = cellSize; cellCanvas.height = cellSize;
                        cellCanvas.getContext('2d').drawImage(canvas, x, y, cellSize, cellSize, 0, 0, cellSize, cellSize);
                        const imageData = cellCanvas.getContext('2d').getImageData(0, 0, cellSize, cellSize);
                        const code = jsQR(imageData.data, cellSize, cellSize);
                        if (code) this.processChunk(code.data);
                    }
                    row++;
                    if (row * cellSize < img.height) setTimeout(scanRow, 10);
                    else resolve();
                };
                scanRow();
            };
            img.src = URL.createObjectURL(file);
        });
    }
}

// ==================== UI ====================
const ui = {
    showToast: (msg, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'info-circle'}"></i><span>${securityUtils.sanitizeHTML(msg)}</span>`;
        dom.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), CONFIG.NOTICE_TIMEOUT);
    },

    log: (msg) => {
        const placeholder = dom.messages.querySelector('.message-placeholder');
        if (placeholder) placeholder.remove();
        const entry = document.createElement('div');
        entry.className = 'message';
        entry.innerHTML = `<span class="message-time">${new Date().toLocaleTimeString()}</span><span class="message-text">${msg}</span>`;
        dom.messages.appendChild(entry);
        const messages = dom.messages.querySelectorAll('.message');
        if (messages.length > CONFIG.MAX_LOG_ENTRIES) messages[0].remove();
        dom.messages.scrollTop = dom.messages.scrollHeight;
    },

    clearLog: () => { 
        dom.messages.innerHTML = '<div class="message-placeholder"><i class="fas fa-comments"></i><p>Ready</p></div>'; 
    },

    showError: (el, msg) => { el.textContent = securityUtils.sanitizeHTML(msg); el.classList.remove('hidden'); setTimeout(() => el.classList.add('hidden'), 3000); },

    updatePasswordStrength: (pass) => { dom.passwordStrengthBar.style.width = cryptoUtils.calculatePasswordStrength(pass) + '%'; },

    showQRModal: (type, data) => {
        dom.qrModalDisplay.innerHTML = '';
        dom.qrModalActions.innerHTML = '';

        let title = 'Secure QR Code';
        if (type === 'gif') title = 'Animated QR GIF';
        else if (type === 'png') title = 'QR PNG Matrix';
        dom.qrModalTitle.textContent = title;

        if (type === 'single') {
            const canvas = data;
            dom.qrModalDisplay.appendChild(canvas);
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '60vh';

            const actions = [
                { icon: 'fa-download', text: 'Download PNG', handler: () => {
                    const link = document.createElement('a');
                    link.download = `hushbox-qr-${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }},
                { icon: 'fa-copy', text: 'Copy Image', handler: async () => {
                    try {
                        const blob = await new Promise(r => canvas.toBlob(r));
                        await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
                        ui.showToast('QR copied', 'success');
                    } catch { ui.showToast('Copy failed', 'error'); }
                }},
                { icon: 'fa-share-alt', text: 'Share', handler: async () => {
                    try {
                        const blob = await new Promise(r => canvas.toBlob(r));
                        const file = new File([blob], 'hushbox-qr.png', { type: 'image/png' });
                        if (navigator.share && navigator.canShare({ files: [file] })) {
                            await navigator.share({ files: [file], title: 'HushBox QR' });
                        } else throw new Error();
                    } catch { ui.showToast('Sharing not supported', 'warning'); }
                }},
                { icon: 'fa-file-pdf', text: 'Export PDF', handler: async () => {
                    if (!window.jspdf) await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    doc.text('HushBox Encrypted', 20, 20);
                    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 50, 30, 100, 100);
                    doc.save(`hushbox-${Date.now()}.pdf`);
                    ui.showToast('PDF exported', 'success');
                }}
            ];
            actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = 'btn-secondary';
                btn.innerHTML = `<i class="fas ${action.icon}"></i> ${action.text}`;
                btn.addEventListener('click', action.handler);
                dom.qrModalActions.appendChild(btn);
            });
        } else {
            const blob = data;
            const url = securityUtils.registerObjectUrl(URL.createObjectURL(blob));
            const img = document.createElement('img');
            img.src = url;
            img.alt = title;
            dom.qrModalDisplay.appendChild(img);

            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'btn-primary';
            downloadBtn.href = url;
            downloadBtn.download = type === 'gif' ? 'hushbox.gif' : 'hushbox-matrix.png';
            downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download ${type.toUpperCase()}`;
            dom.qrModalActions.appendChild(downloadBtn);

            if (navigator.share) {
                const shareBtn = document.createElement('button');
                shareBtn.className = 'btn-secondary';
                shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                shareBtn.addEventListener('click', async () => {
                    try {
                        const file = new File([blob], type === 'gif' ? 'hushbox.gif' : 'hushbox-matrix.png', { type: type === 'gif' ? 'image/gif' : 'image/png' });
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            await navigator.share({ files: [file], title: 'HushBox File QR' });
                        } else throw new Error();
                    } catch { ui.showToast('Sharing not supported', 'warning'); }
                });
                dom.qrModalActions.appendChild(shareBtn);
            }
        }

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-secondary';
        closeBtn.innerHTML = '<i class="fas fa-times"></i> Close';
        closeBtn.addEventListener('click', () => ui.hideQRModal());
        dom.qrModalActions.appendChild(closeBtn);

        dom.qrModal.style.display = 'flex';
    },

    hideQRModal: () => {
        dom.qrModal.style.display = 'none';
        dom.qrModalDisplay.innerHTML = '';
        dom.qrModalActions.innerHTML = '';
    },

    showCameraModal: (mode = 'text') => {
        if (appState.camera) appState.camera.stop();
        appState.camera = new Camera(dom.cameraPreview, dom.detectionBox, dom.cameraHint);
        const onDetect = (data) => {
            if (mode === 'file') {
                if (appState.fileTransferInstance) appState.fileTransferInstance.processChunk(data);
                else if (appState.fileTransferMessageInstance) appState.fileTransferMessageInstance.processChunk(data);
            } else {
                appState.lastEncryptedData = data;
                ui.hideCameraModal();
                const pass = prompt('Enter passphrase:');
                if (pass) handlers.handleDecrypt(data, pass);
            }
        };
        appState.camera.start(mode, onDetect).catch(err => ui.showToast(err.message, 'error'));
        dom.cameraModal.style.display = 'flex';
    },

    hideCameraModal: () => { if (appState.camera) appState.camera.stop(); dom.cameraModal.style.display = 'none'; },

    showProgress: (cur, total, area, fill, text) => {
        area.classList.remove('hidden');
        fill.style.width = (cur/total*100)+'%';
        text.textContent = `${cur}/${total}`;
    },
    updateProgress: (cur, total, fill, text) => {
        fill.style.width = (cur/total*100)+'%';
        text.textContent = `${cur}/${total}`;
    },
    hideProgress: (area) => { area.classList.add('hidden'); },

    updateSessionTimer: (remaining) => { 
        const m = Math.floor(remaining/60000), s = Math.floor((remaining%60000)/1000); 
        dom.sessionTime.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; 
    },

    updateSettingsUI: () => {
        dom.pbkdf2IterationsInput.value = CONFIG.PBKDF2_ITERATIONS;
        dom.securityLevelSelect.value = appState.securityLevel;
        dom.sessionTimeoutInput.value = CONFIG.SESSION_TIMEOUT/60000;
        dom.qrErrorCorrectionSelect.value = CONFIG.QR_ERROR_CORRECTION;
        dom.securityLevelIndicator.className = `security-level ${appState.securityLevel}`;
        dom.securityLevelIndicator.querySelector('span').textContent = `Security Level: ${appState.securityLevel.charAt(0).toUpperCase() + appState.securityLevel.slice(1)}`;
    },

    showTutorial: () => {
        if (localStorage.getItem('hushbox_tutorial_done') === 'true') return;
        appState.tutorialStep = 1;
        ui.updateTutorialStep();
        dom.tutorialModal.style.display = 'flex';
    },

    updateTutorialStep: () => {
        Object.values(dom.tutorialSteps).forEach(el => el.classList.add('hidden'));
        dom.tutorialSteps[appState.tutorialStep].classList.remove('hidden');
        dom.tutorialCounter.textContent = `${appState.tutorialStep}/5`;
        dom.tutorialPrev.disabled = appState.tutorialStep === 1;
        if (appState.tutorialStep === 5) {
            dom.tutorialNext.classList.add('hidden');
            dom.tutorialDone.classList.remove('hidden');
        } else {
            dom.tutorialNext.classList.remove('hidden');
            dom.tutorialDone.classList.add('hidden');
        }
    },

    closeTutorial: () => { 
        dom.tutorialModal.style.display = 'none'; 
        if (dom.dontShowTutorial.checked) localStorage.setItem('hushbox_tutorial_done','true'); 
    },

    showPasteDialog: () => {
        const text = prompt('Paste the QR code text here:');
        if (text) {
            const pass = prompt('Enter passphrase:');
            if (pass) handlers.handleDecrypt(text, pass);
        }
    },

    showDecryptedMessage: (message) => {
        dom.decryptedText.value = message;
        dom.decryptedModal.style.display = 'flex';
    },

    closeDecryptedModal: () => {
        dom.decryptedModal.style.display = 'none';
        dom.decryptedText.value = '';
    },

    setLoading: (button, isLoading) => {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    },

    switchMessagePanelMode: (mode) => {
        if (mode === 'message') {
            dom.messageMode.classList.remove('hidden');
            dom.fileMode.classList.add('hidden');
            dom.sendButton.innerHTML = '<i class="fas fa-lock"></i> Encrypt';
            appState.messagePanelMode = 'message';
        } else {
            dom.messageMode.classList.add('hidden');
            dom.fileMode.classList.remove('hidden');
            dom.sendButton.innerHTML = '<i class="fas fa-qrcode"></i> Generate QR';
            appState.messagePanelMode = 'file';
        }
    }
};

// ==================== CAMERA CLASS ====================
class Camera {
    constructor(video, detectionBox, hintEl) {
        this.video = video;
        this.detectionBox = detectionBox;
        this.hint = hintEl;
        this.stream = null;
        this.scanning = false;
        this.onDetect = null;
        this.frameCount = 0;
        this.timeoutId = null;
    }

    async start(mode, onDetect) {
        if (!navigator.mediaDevices) throw new Error('Camera not supported');
        this.onDetect = onDetect;
        this.scanning = true;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            this.video.srcObject = this.stream;
            await this.video.play();
            this.hint.textContent = mode === 'file' ? 'Scan file chunks in order' : 'Point at QR code';
            this.timeoutId = setTimeout(() => { if (this.scanning) this.stop(); ui.hideCameraModal(); ui.showToast('Scan timeout','warning'); }, CONFIG.CAMERA_TIMEOUT);
            this.scanLoop();
        } catch (err) {
            ui.showToast('Camera access denied','error');
            throw err;
        }
    }

    stop() {
        this.scanning = false;
        if (this.stream) this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.video.srcObject = null;
        this.detectionBox.style.display = 'none';
    }

    scanLoop() {
        if (!this.scanning) return;
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.frameCount++;
            if (this.frameCount % CONFIG.SCAN_FRAME_SKIP === 0) this.detectQR();
        }
        requestAnimationFrame(() => this.scanLoop());
    }

    detectQR() {
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
        if (code) {
            if (code.location) {
                const { topLeft, topRight, bottomLeft, bottomRight } = code.location;
                const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
                const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
                const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
                const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
                this.detectionBox.style.display = 'block';
                this.detectionBox.style.left = minX + 'px';
                this.detectionBox.style.top = minY + 'px';
                this.detectionBox.style.width = (maxX - minX) + 'px';
                this.detectionBox.style.height = (maxY - minY) + 'px';
            }
            if (navigator.vibrate) navigator.vibrate(100);
            if (this.onDetect) this.onDetect(code.data);
        } else {
            this.detectionBox.style.display = 'none';
        }
    }
}

// ==================== HANDLERS ====================
const handlers = {
    handleEncrypt: async (e) => {
        e.preventDefault();
        if (appState.isEncrypting) return;

        if (appState.messagePanelMode === 'message') {
            const msg = dom.messageInput.value.trim(), pass = dom.passphrase.value.trim();
            if (!msg || !pass) return ui.showToast('Message and passphrase required','error');
            try {
                appState.isEncrypting = true;
                ui.setLoading(dom.sendButton, true);
                ui.log('Encrypting...');
                const enc = await cryptoUtils.encryptMessage(msg, pass);
                appState.lastEncryptedData = enc;
                const canvas = document.createElement('canvas');
                await new Promise((resolve, reject) => {
                    QRCode.toCanvas(canvas, enc, { width: CONFIG.QR_SIZE, margin: 2, errorCorrectionLevel: CONFIG.QR_ERROR_CORRECTION }, (err) => {
                        if (err) reject(err); else resolve();
                    });
                });
                ui.showQRModal('single', canvas);
                ui.log('Encryption OK');
                dom.messageInput.value = ''; 
                dom.passphrase.value = ''; 
                ui.updatePasswordStrength('');
                ui.showToast('Message encrypted successfully', 'success');
            } catch (err) { 
                ui.showToast(err.message,'error'); 
                ui.showError(dom.passphraseError, err.message); 
            } finally { 
                appState.isEncrypting = false; 
                ui.setLoading(dom.sendButton, false);
            }
        } else {
            await handlers.handleGenerateFileQRMessage();
        }
    },

    handleDecrypt: async (data, pass) => {
        if (appState.isDecrypting) return;
        try { 
            appState.isDecrypting = true;
            ui.setLoading(dom.scanButtonText, true);
            const dec = await cryptoUtils.decryptMessage(data, pass); 
            ui.log(`Decrypted: ${dec.substring(0,50)}${dec.length>50?'...':''}`); 
            ui.showDecryptedMessage(dec);
            ui.showToast('Decryption successful', 'success');
        } catch (err) { 
            ui.showToast(err.message,'error'); 
        } finally {
            appState.isDecrypting = false;
            ui.setLoading(dom.scanButtonText, false);
        }
    },

    handleFileSelectMessage: (file) => {
        if (!file) return;
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            ui.showToast('File size exceeds 10MB limit', 'error');
            return;
        }
        appState.currentFileMessage = file;
        dom.fileInfoMessage.classList.remove('hidden');
        dom.fileNameMessage.textContent = file.name;
        dom.fileSizeMessage.textContent = (file.size/1024).toFixed(2)+' KB';
    },

    clearFileSelectionMessage: () => {
        appState.currentFileMessage = null;
        dom.fileInfoMessage.classList.add('hidden');
        dom.fileInputMessage.value = '';
    },

    handleGenerateFileQRMessage: async () => {
        if (!appState.currentFileMessage) { ui.log('Select a file first'); return; }
        const pass = dom.filePassphraseMessage.value.trim();
        if (!pass) { ui.showToast('Enter passphrase for file','error'); return; }
        try { cryptoUtils.validatePassphrase(pass, true); } catch (e) { ui.showToast(e.message,'error'); return; }
        const chunkSize = parseInt(dom.chunkSizeMessage.value) || CONFIG.MAX_CHUNK_SIZE;
        if (chunkSize < 500 || chunkSize > 2500) {
            ui.showToast('Chunk size must be between 500 and 2500', 'error');
            return;
        }
        const format = dom.qrFormatMessage.value;
        const cols = parseInt(dom.matrixColsMessage.value) || 3;
        const ft = new FileTransfer('message');
        ft.setPassphrase(pass);
        try {
            ui.setLoading(dom.generateFileQrMessage, true);
            ui.log('Preparing file...');
            await ft.prepareFile(appState.currentFileMessage, chunkSize, pass);
            ui.log(`Generating ${ft.chunks.length} QR codes...`);
            dom.downloadGifLinkMessage.classList.add('hidden');
            dom.downloadPngLinkMessage.classList.add('hidden');
            dom.downloadReconstructedLinkMessage.classList.add('hidden');
            await ft.generateOutput(format, cols);
        } catch (err) { 
            ui.log('Error: '+err.message);
            ui.showToast(err.message, 'error');
        } finally {
            ui.setLoading(dom.generateFileQrMessage, false);
        }
    },

    handleScanFileQRMessage: () => {
        const pass = dom.filePassphraseMessage.value.trim();
        if (!pass) { ui.showToast('Enter passphrase for file','error'); return; }
        try { cryptoUtils.validatePassphrase(pass, true); } catch (e) { ui.showToast(e.message,'error'); return; }
        const ft = new FileTransfer('message');
        ft.setPassphrase(pass);
        appState.fileTransferMessageInstance = ft;
        ui.showCameraModal('file');
    },

    handleUploadMatrixMessage: () => {
        const pass = dom.filePassphraseMessage.value.trim();
        if (!pass) { ui.showToast('Enter passphrase for file','error'); return; }
        try { cryptoUtils.validatePassphrase(pass, true); } catch (e) { ui.showToast(e.message,'error'); return; }
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/png';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const cols = parseInt(dom.matrixColsMessage.value) || 3;
            ui.log('Decoding PNG matrix...');
            const ft = new FileTransfer('message');
            ft.setPassphrase(pass);
            await ft.decodeFromPNGMatrix(file, cols);
        };
        input.click();
    },

    handleFileSelect: (file) => {
        if (!file) return;
        if (file.size > CONFIG.MAX_FILE_SIZE) {
            ui.showToast('File size exceeds 10MB limit', 'error');
            return;
        }
        appState.currentFile = file;
        dom.fileInfo.classList.remove('hidden');
        dom.fileName.textContent = file.name;
        dom.fileSize.textContent = (file.size/1024).toFixed(2)+' KB';
    },

    clearFileSelection: () => {
        appState.currentFile = null;
        dom.fileInfo.classList.add('hidden');
        dom.fileInput.value = '';
    },

    handleGenerateFileQR: async () => {
        if (!appState.currentFile) { ui.log('Select a file first'); return; }
        const pass = dom.filePassphrase.value.trim();
        if (!pass) { ui.showToast('Enter passphrase for file','error'); return; }
        try { cryptoUtils.validatePassphrase(pass, true); } catch (e) { ui.showToast(e.message,'error'); return; }
        const chunkSize = parseInt(dom.chunkSize.value) || CONFIG.MAX_CHUNK_SIZE;
        if (chunkSize < 500 || chunkSize > 2500) {
            ui.showToast('Chunk size must be between 500 and 2500', 'error');
            return;
        }
        const format = dom.qrFormat.value;
        const cols = parseInt(dom.matrixCols.value) || 3;
        const ft = new FileTransfer('main');
        ft.setPassphrase(pass);
        try {
            ui.setLoading(dom.generateFileQr, true);
            ui.log('Preparing file...');
            await ft.prepareFile(appState.currentFile, chunkSize, pass);
            ui.log(`Generating ${ft.chunks.length} QR codes...`);
            dom.downloadGifLink.classList.add('hidden');
            dom.downloadPngLink.classList.add('hidden');
            dom.downloadReconstructedLink.classList.add('hidden');
            await ft.generateOutput(format, cols);
        } catch (err) { 
            ui.log('Error: '+err.message);
            ui.showToast(err.message, 'error');
        } finally {
            ui.setLoading(dom.generateFileQr, false);
        }
    },

    handleScanFileQR: () => {
        const pass = dom.filePassphrase.value.trim();
        if (!pass) { ui.showToast('Enter passphrase for file','error'); return; }
        try { cryptoUtils.validatePassphrase(pass, true); } catch (e) { ui.showToast(e.message,'error'); return; }
        const ft = new FileTransfer('main');
        ft.setPassphrase(pass);
        appState.fileTransferInstance = ft;
        ui.showCameraModal('file');
    },

    handleUploadMatrix: () => {
        const pass = dom.filePassphrase.value.trim();
        if (!pass) { ui.showToast('Enter passphrase for file','error'); return; }
        try { cryptoUtils.validatePassphrase(pass, true); } catch (e) { ui.showToast(e.message,'error'); return; }
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/png';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const cols = parseInt(dom.matrixCols.value) || 3;
            ui.log('Decoding PNG matrix...');
            const ft = new FileTransfer('main');
            ft.setPassphrase(pass);
            await ft.decodeFromPNGMatrix(file, cols);
        };
        input.click();
    },

    handleUploadQRText: () => { dom.uploadQrFile.click(); },

    handleUploadQRTextFile: async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext('2d').drawImage(img,0,0);
            const imageData = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            if (code) {
                appState.lastEncryptedData = code.data;
                const pass = prompt('Enter passphrase:');
                if (pass) handlers.handleDecrypt(code.data, pass);
            } else ui.showToast('No QR found','error');
        };
        img.src = URL.createObjectURL(file);
    },

    copyDecrypted: () => {
        if (dom.decryptedText.value) {
            navigator.clipboard.writeText(dom.decryptedText.value);
            ui.showToast('Copied to clipboard', 'success');
        }
    },

    saveSettings: () => {
        const settings = {
            PBKDF2_ITERATIONS: parseInt(dom.pbkdf2IterationsInput.value) || DEFAULT_CONFIG.PBKDF2_ITERATIONS,
            SECURITY_LEVEL: dom.securityLevelSelect.value,
            SESSION_TIMEOUT: parseInt(dom.sessionTimeoutInput.value) || 30,
            QR_ERROR_CORRECTION: dom.qrErrorCorrectionSelect.value
        };
        if (settings.PBKDF2_ITERATIONS < 100000) return ui.showToast('Iterations too low','error');
        Object.assign(CONFIG, settings);
        appState.securityLevel = settings.SECURITY_LEVEL;
        CONFIG.SESSION_TIMEOUT = settings.SESSION_TIMEOUT * 60000;
        localStorage.setItem('hushbox_settings', JSON.stringify(settings));
        ui.updateSettingsUI();
        ui.showToast('Settings saved','success');
        dom.settingsModal.style.display = 'none';
    },

    resetSettings: () => {
        Object.assign(CONFIG, DEFAULT_CONFIG);
        appState.securityLevel = DEFAULT_CONFIG.SECURITY_LEVEL;
        localStorage.removeItem('hushbox_settings');
        ui.updateSettingsUI();
        ui.showToast('Settings reset','success');
    },

    clearHistory: () => { if (confirm('Clear log?')) ui.clearLog(); },

    tutorialNext: () => { if (appState.tutorialStep < 5) { appState.tutorialStep++; ui.updateTutorialStep(); } },
    tutorialPrev: () => { if (appState.tutorialStep > 1) { appState.tutorialStep--; ui.updateTutorialStep(); } },
    tutorialDone: () => ui.closeTutorial(),

    pasteQr: () => ui.showPasteDialog()
};

// ==================== HELPER ====================
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
}

// ==================== INIT ====================
function init() {
    const saved = localStorage.getItem('hushbox_settings');
    if (saved) {
        const s = JSON.parse(saved);
        Object.assign(CONFIG, s);
        appState.securityLevel = s.SECURITY_LEVEL;
    } else {
        Object.assign(CONFIG, DEFAULT_CONFIG);
        appState.securityLevel = DEFAULT_CONFIG.SECURITY_LEVEL;
    }

    // No hay cambio de tema, fijamos oscuro
    document.documentElement.setAttribute('data-theme', 'dark');

    // Modo mensaje
    dom.encryptForm.addEventListener('submit', handlers.handleEncrypt);
    dom.sendButton.addEventListener('click', handlers.handleEncrypt);
    dom.scanButtonText.addEventListener('click', () => ui.showCameraModal('text'));
    dom.pasteQrButton.addEventListener('click', handlers.pasteQr);
    dom.passphrase.addEventListener('input', e => ui.updatePasswordStrength(e.target.value));
    dom.qs('.generate-password').addEventListener('click', () => { const p = cryptoUtils.generateSecurePass(); dom.passphrase.value = p; ui.updatePasswordStrength(p); });
    dom.messageInput.addEventListener('input', () => { const l = dom.messageInput.value.length; dom.charCounter.textContent = `${l}/${CONFIG.MAX_MESSAGE_LENGTH}`; });

    dom.uploadQrButton.addEventListener('click', handlers.handleUploadQRText);
    dom.uploadFileButton.addEventListener('click', () => ui.switchMessagePanelMode('file'));
    dom.backToMessage.addEventListener('click', () => ui.switchMessagePanelMode('message'));

    // Modo archivo en mensaje
    dom.fileDropZoneMessage.addEventListener('click', () => dom.fileInputMessage.click());
    dom.fileDropZoneMessage.addEventListener('dragover', e => { e.preventDefault(); dom.fileDropZoneMessage.classList.add('dragover'); });
    dom.fileDropZoneMessage.addEventListener('dragleave', () => dom.fileDropZoneMessage.classList.remove('dragover'));
    dom.fileDropZoneMessage.addEventListener('drop', e => { e.preventDefault(); dom.fileDropZoneMessage.classList.remove('dragover'); handlers.handleFileSelectMessage(e.dataTransfer.files[0]); });
    dom.selectFileButtonMessage.addEventListener('click', () => dom.fileInputMessage.click());
    dom.fileInputMessage.addEventListener('change', e => handlers.handleFileSelectMessage(e.target.files[0]));
    dom.clearFileMessage?.addEventListener('click', handlers.clearFileSelectionMessage);
    dom.generateFileQrMessage.addEventListener('click', handlers.handleGenerateFileQRMessage);
    dom.scanFileQrMessage.addEventListener('click', handlers.handleScanFileQRMessage);
    dom.uploadMatrixBtnMessage.addEventListener('click', handlers.handleUploadMatrixMessage);
    dom.qrFormatMessage.addEventListener('change', () => { dom.matrixColsGroupMessage.style.display = dom.qrFormatMessage.value === 'png-matrix' ? 'block' : 'none'; });

    // Modo archivo principal
    dom.fileDropZone.addEventListener('click', () => dom.fileInput.click());
    dom.fileDropZone.addEventListener('dragover', e => { e.preventDefault(); dom.fileDropZone.classList.add('dragover'); });
    dom.fileDropZone.addEventListener('dragleave', () => dom.fileDropZone.classList.remove('dragover'));
    dom.fileDropZone.addEventListener('drop', e => { e.preventDefault(); dom.fileDropZone.classList.remove('dragover'); handlers.handleFileSelect(e.dataTransfer.files[0]); });
    dom.selectFileButton.addEventListener('click', () => dom.fileInput.click());
    dom.fileInput.addEventListener('change', e => handlers.handleFileSelect(e.target.files[0]));
    dom.clearFile?.addEventListener('click', handlers.clearFileSelection);
    dom.generateFileQr.addEventListener('click', handlers.handleGenerateFileQR);
    dom.scanFileQr.addEventListener('click', handlers.handleScanFileQR);
    dom.uploadMatrixBtn.addEventListener('click', handlers.handleUploadMatrix);
    dom.qrFormat.addEventListener('change', () => { dom.matrixColsGroup.style.display = dom.qrFormat.value === 'png-matrix' ? 'block' : 'none'; });

    // Otros eventos
    dom.closeCamera.addEventListener('click', ui.hideCameraModal);
    dom.settingsButton.addEventListener('click', () => dom.settingsModal.style.display = 'flex');
    dom.saveSettings.addEventListener('click', handlers.saveSettings);
    dom.resetSettings.addEventListener('click', handlers.resetSettings);
    dom.cancelSettings.addEventListener('click', () => dom.settingsModal.style.display = 'none');
    dom.qs('#settings-modal .close-modal').addEventListener('click', () => dom.settingsModal.style.display = 'none');
    dom.moreMenu.addEventListener('click', e => { e.stopPropagation(); const exp = dom.dropdown.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'; dom.dropdown.setAttribute('aria-expanded', exp); });
    document.addEventListener('click', () => dom.dropdown.setAttribute('aria-expanded', 'false'));
    dom.uploadQrFile.addEventListener('change', handlers.handleUploadQRTextFile);
    dom.clearLog.addEventListener('click', ui.clearLog);
    dom.qsa('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target ? document.getElementById(btn.dataset.target) : dom.passphrase;
            target.type = target.type === 'password' ? 'text' : 'password';
            btn.querySelector('i').className = `fas fa-${target.type === 'password' ? 'eye' : 'eye-slash'}`;
        });
    });

    // Tutorial
    dom.closeTutorial.addEventListener('click', ui.closeTutorial);
    dom.tutorialPrev.addEventListener('click', handlers.tutorialPrev);
    dom.tutorialNext.addEventListener('click', handlers.tutorialNext);
    dom.tutorialDone.addEventListener('click', handlers.tutorialDone);

    // Modal QR unificado
    dom.closeQrModal.addEventListener('click', ui.hideQRModal);
    dom.qrModal.addEventListener('click', (e) => {
        if (e.target === dom.qrModal) ui.hideQRModal();
    });

    // Decrypted modal
    dom.closeDecryptedBtn.addEventListener('click', ui.closeDecryptedModal);
    dom.copyDecryptedBtn.addEventListener('click', handlers.copyDecrypted);
    dom.decryptedModal.addEventListener('click', (e) => {
        if (e.target === dom.decryptedModal) ui.closeDecryptedModal();
    });

    // Sesión
    setInterval(() => {
        if (!appState.sessionActive) return;
        const remaining = CONFIG.SESSION_TIMEOUT - (Date.now() - appState.lastActivity);
        if (remaining <= 0) { 
            ui.log('Session expired'); 
            appState.sessionActive = false;
            ui.hideQRModal();
            dom.decryptedModal.style.display = 'none';
        } else {
            ui.updateSessionTimer(remaining);
        }
    }, 1000);
    document.addEventListener('click', () => appState.lastActivity = Date.now());

    ui.log('HushBox ready');
    ui.updateSettingsUI();
    ui.showTutorial();
}

document.addEventListener('DOMContentLoaded', init);
