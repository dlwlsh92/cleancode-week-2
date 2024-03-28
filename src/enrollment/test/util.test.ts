export const addHoursToCurrentTime = (hours: number): Date => {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + hours);
    return currentTime;
};