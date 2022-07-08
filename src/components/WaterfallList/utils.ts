import { Image } from 'react-native';

/**
 * 获取heightList最小高度的索引
 * @param heightList 瀑布流存储子视图最高高度
 * @returns number
 */
export const getMinHeight = (heightList: number[]): number => {
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
};

/**
 * 获取当前数据长度
 * @param array dataSource
 * @returns number
 */
export const getArrayTotalLength = (array: Array<any>[]): number => {
  return array.reduce((a, b) => a + b.length, 0);
};

/**
 * 获取网络图片的尺寸
 * @param url 图片地址
 * @returns
 */
export const getImageSize = async (url: string) => {
  let height = 0;
  let width = 0;
  try {
    const size = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        Image.getSize(
          url,
          (imageWidth, imageHeight) => {
            resolve({
              width: imageWidth,
              height: imageHeight,
            });
          },
          reject
        );
      }
    );
    width = size.width;
    height = size.height;
  } catch (err) {
    console.log({ err });
  }

  return { width, height };
};
