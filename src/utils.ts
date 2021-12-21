export const degreesToRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
};

export const random = (min: number, max: number, float = false) => {
    const val = Math.random() * (max - min) + min;

    if (float) {
        return val;
    }

    return Math.floor(val);
};
