import { StyleSheet, Dimensions, Platform } from 'react-native';
import * as ViewUtils from '../../utils/viewUtils';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const itemHorizontalMargin = wp(1.2);
const slideWidth = wp(78) - itemHorizontalMargin * 2;
const slideHeight = viewportHeight * 0.65;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 4;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        //paddingBottom: 24, // needed for shadow
    },
    imageContainer: {
        flex: 0.7,
        backgroundColor: '#FFF',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        shadowColor: '#888',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer: {
        flex: 0.3,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius,
        borderWidth: 2,
        borderTopWidth: 0,
        borderColor: '#F6F6F6'

    },
    image: {
        minWidth: 175,
        minHeight: 175
    },
    title: {
        color: ViewUtils.COLOR_THEME_BLUE,
        textShadowColor: 'black',
        textShadowOffset: {width: 0.5, height: 0.5},
        fontSize: 17,
        fontFamily: ViewUtils.FONT_DOSIS_SEMI_BOLD,
        letterSpacing: 0.5
    },
    subtitle: {
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        marginTop: 6,
        color: ViewUtils.COLOR_THEME_BLUE,
        fontSize: 12,
    },
    descriptionText: {
      fontSize: 19,
      color: ViewUtils.COLOR_THEME_BLUE,
      textAlign: 'center',
      fontFamily: ViewUtils.FONT_DOSIS_SEMI_BOLD,
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    noItemContainer: {
        flex: 1,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: ViewUtils.THEME_DEFAULT_FONT,
        color: '#36454F'
    },
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
    }
});
