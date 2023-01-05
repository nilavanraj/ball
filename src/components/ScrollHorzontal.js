import React, {PureComponent} from 'react';
import {View, ScrollView, TouchableWithoutFeedback} from 'react-native';

export default class HorizontalPicker extends PureComponent {
  constructor(props) {
    super(props);
    this.paddingSide = 0;
    this.refScrollView = React.createRef();
    this.ignoreNextScroll = false;
    this.timeoutDelayedSnap = 0;
    this.currentPositionX = 0;

    this.state = {
      scrollViewWidth: 0,
    };
  }

  onLayoutScrollView = e => {
    setTimeout(this.scrollToDefaultIndex, 0);
    const {width} = e.nativeEvent.layout;
    this.setState(() => ({scrollViewWidth: width}));
    this.paddingSide = width / 2 - this.props.itemWidth / 2;

    if (this.props.onLayout != null) {
      this.props.onLayout(e);
    }
  };

  onScroll = e => {
    this.currentPositionX = e.nativeEvent.contentOffset.x;

    if (this.props.onScroll != null) {
      this.props.onScroll(e);
    }
  };

  onScrollBeginDrag = e => {
    this.ignoreNextScroll = false;

    if (this.props.onScrollBeginDrag != null) {
      this.props.onScrollBeginDrag(e);
    }
  };

  onScrollEndDrag = e => {
    this.cancelDelayedSnap();
    if (this.ignoreNextScroll) {
      this.ignoreNextScroll = false;
    } else {
      this.setDelayedSnap();
    }

    if (this.props.onScrollEndDrag != null) {
      this.props.onScrollEndDrag(e);
    }
  };

  onMomentumScrollBegin = e => {
    this.ignoreNextScroll = false;
    this.setDelayedSnap();

    if (this.props.onMomentumScrollBegin != null) {
      this.props.onMomentumScrollBegin(e);
    }
  };

  onMomentumScrollEnd = e => {
    if (this.ignoreNextScroll) {
      this.ignoreNextScroll = false;
    } else {
      this.setDelayedSnap();
    }

    if (this.props.onMomentumScrollEnd != null) {
      this.props.onMomentumScrollEnd(e);
    }
  };

  scrollToPosition = position => {
    const {itemWidth, onChange} = this.props;
    const x = position * itemWidth;
    this.ignoreNextScroll = true;

    if (this.refScrollView.current != null) {
      this.refScrollView.current.scrollTo({x, y: 0, animated: true});
    }

    if (onChange != null) {
      if (position < 1) {
        onChange(0);
      } else if (position > this.props.data.length) {
        onChange(this.props.data.length - 1);
      } else {
        onChange(position);
      }
    }
  };

  cancelDelayedSnap = () => {
    clearTimeout(this.timeoutDelayedSnap);
  };

  setDelayedSnap = timeout => {
    const snapTimeout =
      timeout || this.props.snapTimeout || this.defaultSnapTimeout;
    const {itemWidth} = this.props;
    this.cancelDelayedSnap();
    this.timeoutDelayedSnap = setTimeout(() => {
      const nextPosition = Math.round(this.currentPositionX / itemWidth);
      this.scrollToPosition(nextPosition);
    }, snapTimeout);
  };

  scrollToDefaultIndex = () => {
    if (this.refScrollView.current != null && this.props.defaultIndex != null) {
      const {defaultIndex, itemWidth, data} = this.props;

      if (defaultIndex >= data.length) {
        console.warn(
          "@vseslav/react-native-horizontal-picker: 'defaultIndex' is out of range of the array 'data'",
        );
        return;
      }

      const x = defaultIndex * itemWidth;
      this.refScrollView.current.scrollTo({
        x,
        y: 0,
        animated: this.props.animatedScrollToDefaultIndex || false,
      });
    }
  };

  render() {
    const {data, renderItem, ...props} = this.props;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={this.defaultScrollEventThrottle}
        decelerationRate={this.defaultDecelerationRate}
        contentContainerStyle={{paddingHorizontal: this.paddingSide}}
        ref={this.refScrollView}
        onLayout={this.onLayoutScrollView}
        onScroll={this.onScroll}
        onScrollEndDrag={this.onScrollEndDrag}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        {...props}>
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            onPress={() => this.scrollToPosition(index)}
            key={index}>
            <View>{renderItem(item, index)}</View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    );
  }
}
