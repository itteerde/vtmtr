export const consoleColors = { // https://i.sstatic.net/9UVnC.png
    off: '\x1b[0m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    brightMagenta: '\x1b[95m'
}

export function color(color, msg) {

    return `${color}${msg}${consoleColors.off} `
}