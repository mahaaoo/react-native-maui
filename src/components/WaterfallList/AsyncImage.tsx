import React, { useCallback, useState } from 'react';
import { Image, ImageResizeMode, ViewStyle } from 'react-native';
import { SkeletonContainer, SkeletonRect, Breath } from '../Skeleton';

interface AsyncImageProps {
  url: string;
  style?: ViewStyle;

  resizeMode?: ImageResizeMode;
}

const AsyncImage: React.FC<AsyncImageProps> = (props) => {
  const { style, url, resizeMode = 'cover' } = props;
  const [finished, setFinished] = useState(false);
  const [imageSize, setImageSize] = useState<{
    width: number | string;
    height: number | string;
  }>(() => {
    return {
      width: style?.width || 0,
      height: style?.height || 0,
    };
  });

  useState(() => {
    if (imageSize.height === 0 || imageSize.width === 0) {
      Image.getSize(url, (width: number, height: number) => {
        const getWidth = imageSize.width === 0 ? width : imageSize.width;
        const getHeight = imageSize.height === 0 ? height : imageSize.height;

        setImageSize({ width: getWidth, height: getHeight });
      });
    }
  });

  const loadFinish = useCallback(() => {
    setTimeout(() => {
      setFinished(true);
    }, 2000);
  }, []);

  return (
    <SkeletonContainer
      childAnimation={Breath}
      finished={finished}
      reverse={true}
    >
      <SkeletonRect style={{ ...style, ...imageSize }}>
        <Image
          source={{ uri: url }}
          onLoad={loadFinish}
          style={{
            ...imageSize,
          }}
          resizeMode={resizeMode}
        />
      </SkeletonRect>
    </SkeletonContainer>
  );
};

export default AsyncImage;
