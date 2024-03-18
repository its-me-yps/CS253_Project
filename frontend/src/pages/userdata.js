let userName = "";
let feivn = "";

const setUserName = (name) => {
  userName = name;
}
const getUserName = () => {
    return userName;
}

const setFeivn = (name) => {
    feivn = name;
}
const getFeivn = () => {
    return feivn;
}
export { setUserName, getUserName, setFeivn, getFeivn };
