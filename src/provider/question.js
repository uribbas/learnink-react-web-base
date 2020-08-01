import firebase, { auth, db } from './database';

export const shuffleArray = (array)=> {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getQuestions = (selections, suffleAns)=>{
  const {showCardAction, subject, chapter, selectedDifficulty, selectedQType} = selections;
  console.log("getQuestions", chapter, selectedQType,selectedDifficulty);
  let questionRef = db.collection("questions")
                   .where("gradeId","==", chapter.gradeId)
                   .where("subjectId","==", chapter.subjectId)
                   .where("chapterId","==", chapter.chapterId);
  // Additional filter if applicable
  if(selectedDifficulty){
    questionRef = questionRef.where("difficulty","==",selectedDifficulty.name);
  }
  if(selectedQType){
    questionRef = questionRef.where("type","==",selectedQType.name.toUpperCase());
  }

  // Now run the query with order by and limit clause
  return questionRef
  .orderBy("questionSequenceId",'asc')
  .limit(50)
  // .onSnapshot
  .get()
  .then((querySnapshot)=>{
      let questions = [];
      querySnapshot.forEach((doc)=>{
          let data = doc.data();
          if(data.type=="STANDARD" && suffleAns == true) {
            data['answerArrays'] = shuffleArray(Object.keys(data.answer));
          }
          questions.push({...data, docId: doc.id});
      });
      console.log("questions fetched: ", questions);
      return questions;
  });
}
