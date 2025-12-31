function cleanUserStatus(userName, usersSteps) {
  if (usersSteps.has(userName)) {
    usersSteps.delete(userName);
  }
}



export default cleanUserStatus;