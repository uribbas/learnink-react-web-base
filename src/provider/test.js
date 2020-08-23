import firebase, { auth, db, storage } from './database';
import { shuffleArray, getNSuffleIdsofRange } from './question';



export const getTestQuestions = async (test)=>{
  let remainingNoOfQ = test.totalQuestions;
  let categoryWeights  = test.categoryWeights;
  let questionSelected = { easy :[], moderate: [], difficult: [] };
  // Now loop for each chapters includedd for the test
  let i = test.chaptersCovered.length-1;
  while(i>=0){
    let c=test.chaptersCovered[i];
    let qdId = [c.gradeId, c.subjectId, c.chapterId].join('_');
    let qd = null;
    // get the question document distribution numbers for the chapter
    qd = await db.collection("questionDistribution").doc(qdId)
            .get()
            .then((doc)=>{
              return {...doc.data(),docId: doc.id};
            });
    // now for each difficulty get the question set
    Object.keys(questionSelected).forEach((d,k)=>{
      let noOfCatQ = 0;
      if(test.isAdaptive){
        if(i==0){
          // this is the last item of the category details, so use all the remainingNoOfQ
          noOfCatQ = remainingNoOfQ;
        } else {
          // note that all weightages we registered as % of the set, so divide by 10000
          let factor = (c.chapterWeights)/100;
          noOfCatQ = Math.floor(factor * test.totalQuestions);
          if(k==0){
            remainingNoOfQ -= noOfCatQ;
          }
        }
      } else {
        if(i==0 && k==(Object.keys(questionSelected).length -1)){
          // this is the last item of the category details, so use all the remainingNoOfQ
          noOfCatQ = remainingNoOfQ;
        } else {
          // note that all weightages we registered as % of the set, so divide by 10000
          let factor = (categoryWeights[d] *  c.chapterWeights)/10000;
        	noOfCatQ = Math.floor(factor * test.totalQuestions);
          remainingNoOfQ -= noOfCatQ;
        }
      }
      console.log("done for ", i, c.chapterId, d,noOfCatQ, remainingNoOfQ);

      // Now we have to suffle and get the required no of sequence ids for the cat questions
    	let qseqIds = getNSuffleIdsofRange(qd[d],noOfCatQ)
                    .map(qid=>[c.gradeId, c.subjectId, c.chapterId,d,qid].join('_'));
      // Now that we know we have required qseqIds, lets append the list of question
      questionSelected[d]=[...questionSelected[d],...qseqIds];
    })
    i--;
  }
  // Lets suffle the questions and return suffled questions
  return {
            easy: shuffleArray(questionSelected.easy),
            moderate: shuffleArray(questionSelected.moderate),
            difficult: shuffleArray(questionSelected.difficult)
          };

}
