import firebase, { auth, db, storage } from './database';

export const shuffleArray = (array)=> {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const getNSuffleIdsofRange = (rangeLength, n)=> {
  let _q = Array.from(Array(rangeLength), (_, i) => i + 1);
  shuffleArray(_q)
  return _q.splice(0, n);
}

export const getQuestions = async (selections, noOfQuestion, suffleAns)=>{
  let questions = [];
  const {showCardAction, subject, chapter, selectedDifficulty, selectedQType, qdData} = selections;
  let _qidList = getNSuffleIdsofRange(qdData[selectedDifficulty.name], noOfQuestion);
  // console.log("getQuestions", _qidList, chapter, selectedQType,selectedDifficulty);
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
  while(_qidList.length >0){
    let _seqIdsToprocess = _qidList.splice(0,10);
    // console.log("_seqIdsToprocess",_seqIdsToprocess);
    await questionRef
    .where("questionSequenceId","in",_seqIdsToprocess)
    // .orderBy("questionSequenceId",'asc')
    // .limit(50)
    // .onSnapshot
    .get()
    .then((querySnapshot)=>{
        // let questions = [];
        querySnapshot.forEach((doc)=>{
            let data = doc.data();
            if(data.type=="STANDARD" && suffleAns == true) {
              data['answerArrays'] = shuffleArray(Object.keys(data.answer));
            }
            if(!data.photos){data.photos=[]}
            questions.push({...data, docId: doc.id});
        });
        // console.log("questions fetched: ", questions);
    });
  }
  // console.log("questions fetched returned : ", questions);
  // Lets suffle the questions and return suffled questions
  return shuffleArray(questions);

}

export const getqDData = async (selectedChapter)=>{
  let qd = null;
  await db.collection('questionDistribution')
    .where("gradeId","==", selectedChapter.gradeId)
    .where("subjectId","==", selectedChapter.subjectId)
    .where("chapterId","==", selectedChapter.chapterId)
    .get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            qd = {...doc.data(),docId: doc.id};
        });
    });

    return qd;
}

export const putStorageItem = (path, file, item)=>{
  // the return value will be a Promise
  return storage.ref(path).put(file)
  .then(async (snapshot) => {
    await snapshot.ref.getDownloadURL()
    .then((fireBaseUrl)=>{
      console.log('One success:', fireBaseUrl);
      item.url = fireBaseUrl;
    });
  }).catch((error) => {
    console.log('One failed:', path, error.message)
  });
}

export const removeStorageItem = (url)=>{
  // the return value will be a Promise
  return storage.refFromURL(url)
  .delete()
  .then(async () => {
    console.log('Deleted successfully:', url);
  }).catch((error) => {
    console.log('Delete failed:', url, error.message);
  });
}

export const replaceImageWithUrl= (text, photos)=>{
  // const {question} = this.state;
  let preview = text;
  photos.forEach(p=>{
    // let newImgTxt = p.url ? ("\\<img src='" + (p.url) + "'") : ("<img src='" + p.preview + "'");
    let newImgTxt = p.url ? p.url :  p.preview;
    preview = preview.replace(new RegExp(p.name,'g'),newImgTxt );
    // console.log("Preview process ", p.name, newImgTxt, preview, preview=="<"+p.name+"\\/>");
  })
  // preview = "\\includegraphics[height=5em, alt=KA logo]{https://firebasestorage.googleapis.com/v0/b/deb-learnink-dev.appspot.com/o/images%2Fgrade%2F6%2FMaths%2Fdatarep%2F6_Maths_datarep_easy_1%2FIMAGE1596508920254.png?alt=media&token=3045c034-7fb5-4365-a7f7-c11c888e44ba}";
  // let p = katex.renderToString(preview ? preview : '', {
  //   "displayMode":false,"leqno":false,"fleqn":false,"throwOnError":false,"errorColor":"#cc0000",
  //   "strict":"warn","output":"htmlAndMathml","trust":true,"macros":{"\\f":"f(#1)"}
  // });
  // console.log("p is ", p);
  return preview;
}
