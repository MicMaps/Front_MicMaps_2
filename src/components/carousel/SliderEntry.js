import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ViewUtils from '../../utils/viewUtils';
import styles from './SliderEntry.style';

export default class SliderEntry extends Component {

    static propTypes = {
        // title: PropTypes.string.isRequired,
        // subtitle: PropTypes.string,
        // illustration: PropTypes.string,
        // even: PropTypes.bool
    };

    render () {
        const { entry, onSelectView } = this.props;
        let slider = Math.floor(ViewUtils.WINDOW_HEIGHT * 0.48);

        return (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.slideInnerContainer}
              onPress={() => onSelectView ? onSelectView(entry): null }>
                <View style={[styles.imageContainer, {backgroundColor: entry.backgroundColor}]}>
                    <Image source={entry.image.src} style={{width: entry.image.width, height: entry.image.height}} />
                    {/* <View style={styles.radiusMask} /> */}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.descriptionText}>{entry.description}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
