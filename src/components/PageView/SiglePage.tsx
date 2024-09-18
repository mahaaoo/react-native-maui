import { View } from 'react-native';

interface SiglePageProps {
  children: React.ReactNode;
  contentSize: number;
}

const SiglePage: React.FC<SiglePageProps> = (props) => {
  const { children, contentSize } = props;
  return <View style={{ width: contentSize }}>{children}</View>;
};

export default SiglePage;
