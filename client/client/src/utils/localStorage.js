export function set(key, value) {
    const keyVerifed = key.toString();
    if (!keyVerifed || !value) {
        return
    }

    localStorage.setItem(keyVerifed, JSON.stringify(value));
}

export function get(key) {
    const keyVerifed = key.toString();

    try {
        if (!keyVerifed) {
            return
        }

        const data = localStorage.getItem(keyVerifed);
        if (data === null) {
            return null;
        }

        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка', error);
        return null;
    }
}

export function remove(key) {
    const keyVerifed = key.toString();

    if (!keyVerifed) {
        return null;
    }

    localStorage.removeItem(keyVerifed);
}

export function clear() {
    localStorage.clear();
}