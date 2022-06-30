export const useMinHeight = (heightList: number[]) => {  
  let minIndex = 0;
  let minHeight = heightList[0];
  
  for (let i = 0; i < heightList.length; i++) {
    const height = heightList[i];
    if (height < minHeight) {
      minHeight = height;
      minIndex = i;
    }
  }
  return minIndex;
}