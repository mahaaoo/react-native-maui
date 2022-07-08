import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  FlatListProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export enum RefreshState {
  Idle = 0 << 1,
  HeaderRefreshing = 1 << 2,
  FooterRefreshing = 2 << 3,
  NoMoreData = 3 << 4,
  Failure = 4 << 5,
}

export interface RefreshListProps extends FlatListProps<any> {
  data: Array<any>;

  refreshState: RefreshState;
  onHeaderRefresh?: () => void;
  onFooterRefresh?: () => void;

  footerContainerStyle?: StyleProp<ViewStyle>;
  footerTextStyle?: StyleProp<TextStyle>;

  footerRefreshingText?: string;
  footerFailureText?: string;
  footerNoMoreDataText?: string;
  canRefresh?: boolean;
  refreshListActivityIndicatorColor?: string;
  ref?: any;
}

const RefreshList: React.FC<RefreshListProps> = (props) => {
  const {
    refreshState = RefreshState.Idle,
    data,
    onFooterRefresh,
    onHeaderRefresh,
    footerContainerStyle,
    footerTextStyle,
    footerRefreshingText = '数据加载中…',
    footerFailureText = '点击重新加载',
    footerNoMoreDataText = '已加载全部数据',
    canRefresh = true,
    ref,
    refreshListActivityIndicatorColor = '#888888',
    ...options
  } = props;

  const shouldStartHeaderRefreshing = useMemo(() => {
    if (
      refreshState === RefreshState.HeaderRefreshing ||
      refreshState === RefreshState.FooterRefreshing
    ) {
      return false;
    }

    return true;
  }, [refreshState]);

  const shouldStartFooterRefreshing = useMemo(() => {
    if (data.length === 0) {
      return false;
    }

    return refreshState === RefreshState.Idle;
  }, [refreshState, data]);

  const headerRefresh = useCallback(() => {
    if (shouldStartHeaderRefreshing && canRefresh) {
      onHeaderRefresh && onHeaderRefresh();
    }
  }, [canRefresh, onHeaderRefresh]);

  const endReached = useCallback(() => {
    if (shouldStartFooterRefreshing && canRefresh) {
      onFooterRefresh && onFooterRefresh();
    }
  }, [canRefresh, onFooterRefresh]);

  const renderFooter = () => {
    let footer = null;

    const footerStyle = [styles.footerContainer, footerContainerStyle];
    const textStyle = [styles.footerText, footerTextStyle];

    switch (refreshState) {
      case RefreshState.Idle:
        footer = <View style={footerStyle} />;
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity
            style={footerStyle}
            onPress={() => {
              onFooterRefresh && onFooterRefresh();
            }}
          >
            <Text style={textStyle}>{footerFailureText}</Text>
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.FooterRefreshing: {
        footer = (
          <View style={footerStyle}>
            <ActivityIndicator
              size="small"
              color={refreshListActivityIndicatorColor}
            />
            <Text style={[textStyle, styles.footerLoading]}>
              {footerRefreshingText}
            </Text>
          </View>
        );
        break;
      }
      case RefreshState.NoMoreData: {
        if (data === null || data.length === 0) {
          footer = <View />;
        } else {
          footer = (
            <View style={footerStyle}>
              <Text style={textStyle}>{footerNoMoreDataText}</Text>
            </View>
          );
        }
        break;
      }
      default:
        break;
    }

    return footer;
  };

  if (!data || data.length === 0) {
    return <Text>暂无数据</Text>;
  }

  return (
    <FlatList
      ref={ref}
      data={data}
      onRefresh={headerRefresh}
      refreshing={refreshState === RefreshState.HeaderRefreshing}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.3}
      onEndReached={endReached}
      keyExtractor={(item, index) => index.toString()}
      {...options}
    />
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 44,
  },
  footerText: {
    fontSize: 14,
  },
  footerLoading: {
    marginLeft: 7,
  },
});

export default RefreshList;
