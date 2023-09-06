export const getUserId = () => {
    const infoStr = localStorage.getItem('info');
    if (!infoStr) return null;
    const info = JSON.parse(infoStr);
    return info.id;
}