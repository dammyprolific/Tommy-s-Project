function generateRandomAlphanumeric(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVTWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let results ='';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        results += characters[randomIndex];

    }
    return results;
}

export const  randomValue = generateRandomAlphanumeric();