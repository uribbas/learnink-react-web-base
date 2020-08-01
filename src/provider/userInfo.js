import firebase, { auth, db } from './database';

export const getUserProfile= (userAuth) => {
  // we only get userProfile for a valid usersigned in with auth details
  if(!userAuth){
    console.log('No user details supplied, please check!');
    return null;
  }
  const {uid, email, phoneNumber, displayName }=userAuth;
  if(!uid){
    console.log('Invalid user details supplied, please check!');
    return null;
  }
  return db.collection("users").where("uid","==",uid)
  .get()
  .then(async (querySnapshot)=>{
      // doc.data() is never undefined for query doc snapshots
      // console.log("User data", doc.id, id, " => ", userData);
      let id = null;
      let userData = null;
      querySnapshot.forEach((doc)=>{
        id = doc.id;
        userData = doc.data();
      })
      if (userData) {
          // console.log("User data document:", userData);
          return { id, ...userData };

      } else {
          if(!email && !phoneNumber){
            console.log('Incomplete user details supplied, please check!');
            return null;
          }
          // doc.data() will be undefined in this case
          let userProfile = { uid: uid,
                              email: email ? email : null,
                              phoneNumber: phoneNumber? phoneNumber: null,
                              name: displayName ? displayName: null,
                              userCreationTimeStamp: new Date(),
                             };
          console.log("add userProfile:", userProfile);
          return db.collection("users").add(userProfile)
          .then((res)=>{
            Object.assign(userProfile,{id: res.id});
            return userProfile;
          });

      }
  })
  .catch((error)=> {
      console.log("Error getting document:", error);
      console.log(error);
      return null;
  });

}
