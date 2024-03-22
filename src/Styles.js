import { Platform, Dimensions } from 'react-native';

const OS = Platform.OS;

const DIMENSIONS = Dimensions.get( 'window' );
const xlViewport = DIMENSIONS.width > 375;

export const VARS = {
    colors: {
        white: '#FFF',
        gray: {
            xxlight: '#F6F6F6',
            xlight: '#E8E8E8',
            light: '#B9B9B9',
            xxdark: '#333',
        },
        navy: {
            default: '#1D1539'
        },
        blue: {
            light: '#71C5E8',
            default: '#3CB0E0',
            dark: '#4859A3'
        },
        yellow: {
            //default: '#F2C75C'
            default: '#FBBA00'
        },
        green: {
            default: '#48bb78'
        },
        pink: {
            default: '#D31674'
        },
        purple: {
            default: '#9A2677',
            xxlight: '#E5CCF4'
        },
        burgundy: {
            default: '#991154'
        },
        error: {
            default: '#B7312C'
        }
    },
    gradients: {
        navy: ['#374182', '#1D1E53'],
        orange: ['#EF6828', '#D11F74'],
        blue: ['#418CC6', '#4859A3'],
        purple: ['#9A2677', '#4D307B'],
        pink: ['#EF4A81', '#991154'],
        green: ['#288B38', '#E0C259'],
        left: { x: 0, y: 0 },
        right: { x: 1, y: 0 },
        top: { x: 0, y: 0 },
        bottom: { x: 0, y: 1 },
    },
    fonts: {
        family: {
            kapra: OS === 'ios' ? 'Kapra-Regular' : 'Kapra-Regular',
            darwin_light: OS === 'ios' ? 'Darwin-Light' : 'Darwin-Light',
            darwin_bold: OS === 'ios' ? 'Darwin-Bold' : 'Darwin-Bold',
        },
        size: {
            legal: 12,
            small: 12,
            body: 14,
            lead: 18,
        }
    },
    spacer: {
        xsmall: 9,
        small: 18,
        medium: 27,
        large: 36
    },
    borderRadius: {
        small: 4,
        default: 8
    }
}

const buttonBase = {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
}

const buttonBaseText = {
    fontFamily: VARS.fonts.family.darwin_bold,
    textTransform: 'uppercase',
    fontSize: VARS.fonts.size.body,
    letterSpacing: 1,
    textAlign: 'center',
}

export const STYLES = {
    colors: VARS.colors,
    gradients: VARS.gradients,
    text: {
        paragraph: {
            flex: 0,
            width: '100%',
            marginBottom: 20,
        },
        small_bold: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: VARS.fonts.size.small,
            color: VARS.colors.navy.default,
            lineHeight: 16
        },
        body_bold: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: VARS.fonts.size.body,
            color: VARS.colors.navy.default,
            lineHeight: 22
        },
        body_light: {
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.body,
            color: VARS.colors.navy.default,
            lineHeight: 22
        },
        legal_light: {
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
        legal_bold: {
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
        legal_heading: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: VARS.fonts.size.body,
            color: VARS.colors.white,
            lineHeight: 22
        },
        heading2: {
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: 36,
            lineHeight: 50
        },
        heading3: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: 24,
            lineHeight: 29
        },
        heading4: {
            fontFamily: VARS.fonts.family.darwin_bold,
            color: VARS.colors.navy.default,
            fontSize: 20,
            lineHeight: 24
        },
        heading5: {
            fontFamily: VARS.fonts.family.darwin_bold,
            color: VARS.colors.navy.default,
            fontSize: 18,
            lineHeight: 24
        },
        bullet_row: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: '100%',
            marginBottom: 5,
        },
        bullet_sub_row: {
            paddingLeft: 25,
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
        },
        bullet_mark: {
            width: 20,
            flexShrink: 0,
            flexGrow: 0,
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
        bullet_content: {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            paddingLeft: 5,
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
        bullet_content_bold: {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            paddingLeft: 5,
            fontFamily: VARS.fonts.family.darwin_light,
            fontWeight: 'bold',
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
        table: {
            marginBottom: 20,
        },
        table_row: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: '100%',
            paddingBottom: 2,
            paddingTop: 2,
            borderBottomWidth: 1,
            borderBottomColor: VARS.colors.white
        },
        table_head: {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            paddingLeft: 2,
            paddingRight: 2,
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
        table_cell: {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            paddingLeft: 2,
            paddingRight: 2,
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.legal,
            color: VARS.colors.white,
            lineHeight: 16
        },
    },
    header: {
        container: {
            flex: 1,
        },
        headerStyle: {
            backgroundColor: VARS.colors.navy.default,
        },
        headerTintColor: VARS.colors.white,
        headerTitleStyle: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
    },
    container: {
        default: {
            flex: 1
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }
    },
    section: {
        large: {
            flex: 0,
            paddingLeft: VARS.spacer.large,
            paddingRight: VARS.spacer.large,
            paddingTop: VARS.spacer.large,
            paddingBottom: VARS.spacer.large
        },
        inner_padding_sides: {
            paddingLeft: VARS.spacer.large,
            paddingRight: VARS.spacer.large,
        },
        inner_padding_top: {
            paddingTop: VARS.spacer.large,
        },
        inner_stroke_top: {
            paddingTop: VARS.spacer.large,
            borderTopWidth: 2,
            borderTopColor: 'rgba(255,255,255,0.4)'
        }
    },
    button: {
        base: {
            button: buttonBase,
            text: buttonBaseText,
        },
        yellow: {
            button: {
                ...buttonBase,
                backgroundColor: VARS.colors.yellow.default,
            },
            text: {
                ...buttonBaseText,
                color: VARS.colors.white,
            }
        },
        pink: {
            button: {
                ...buttonBase,
                backgroundColor: VARS.colors.pink.default,
            },
            text: {
                ...buttonBaseText,
                color: VARS.colors.white,
            }
        },
        navy: {
            button: {
                ...buttonBase,
                backgroundColor: VARS.colors.navy.default,
            },
            text: {
                ...buttonBaseText,
                color: VARS.colors.white,
            }
        },
        white: {
            button: {
                ...buttonBase,
                backgroundColor: VARS.colors.white,
            },
            text: {
                ...buttonBaseText,
                color: VARS.colors.navy.default,
            }
        },
        disabled: {
            button: {
                ...buttonBase,
                backgroundColor: VARS.colors.gray.light,
            },
            text: {
                ...buttonBaseText,
                color: VARS.colors.white,
            }
        }
    },
    modal: {
        overlay: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: VARS.spacer.small,
            backgroundColor: 'rgba(0,0,0,0.8)'
        },
        panel: {
            flex: 0,
            width: DIMENSIONS.width - ( 2 * VARS.spacer.small ),
            borderRadius: 4,
            backgroundColor: VARS.colors.white,
            overflow: 'hidden'
        },
        confirm: {
            flex: 0,
            width: 100,
            height: 100,
            borderRadius: 4,
            alignItems: 'center',
            backgroundColor: VARS.colors.white,
            overflow: 'hidden'
        },
        body: {
            padding: VARS.spacer.large
        },
        button: {
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: 15,
            borderTopWidth: 1,
            borderColor: VARS.colors.gray.xlight
        },
        button_text: {
            fontSize: VARS.fonts.size.body,
            fontFamily: VARS.fonts.family.darwin_bold,
            textAlign: 'center',
            textTransform: 'uppercase',
        }
    },
    panel: {
        block: {
            marginBottom: VARS.spacer.small,
            backgroundColor: VARS.colors.gray.xxlight,
            borderRadius: VARS.borderRadius.small,
            borderWidth: 1,
            borderColor: VARS.colors.gray.xxdark,
        },
        inner: {
            padding: VARS.spacer.small,
        },
        text_bold: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: VARS.fonts.size.body,
            lineHeight: 18,
            color: VARS.colors.gray.xxdark,
            paddingBottom: 9
        },
        text_light: {
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: 10,
            lineHeight: 14,
            color: VARS.colors.gray.xxdark,
            paddingBottom: 9
        },
        button: {
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: 15,
            borderTopWidth: 1,
            borderColor: VARS.colors.gray.light
        },
        button_text: {
            fontSize: VARS.fonts.size.body,
            fontFamily: VARS.fonts.family.darwin_bold,
            textAlign: 'center',
            textTransform: 'uppercase',
        }
    },
    tabs: {
        header: {
            //flex: 0,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            paddingTop: VARS.spacer.large,
            paddingBottom: VARS.spacer.large
        },
        header_button: {
            //flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 10,
            paddingRight: 10
        },
        header_button_text: {
            fontSize: 17,
            lineHeight: 22,
            fontFamily: VARS.fonts.family.darwin_bold,
            textAlign: 'center',
        },
        header_active_indicator: {
            flex: 0,
            width: 17,
            height: 3,
            backgroundColor: VARS.colors.yellow.default
        },
        panel: {
            flex: 1,
            width: '100%',
            //paddingLeft: VARS.spacer.large,
            //paddingRight: VARS.spacer.large
        }
    },
    menu: {
        primary_button: {
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
            height: 40
        },
        primary_button_icon_wrapper: {
            width: 42,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        primary_button_icon: {

        },
        primary_button_text: {
            fontFamily: VARS.fonts.family.darwin_bold,
            textTransform: 'uppercase',
            fontSize: VARS.fonts.size.lead,
            lineHeight: 18,
            color: VARS.colors.white
        },
        basic_button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            width: '100%',
            paddingTop: 6,
            paddingBottom: 6
        },
        basic_button_text: {
            fontFamily: VARS.fonts.family.darwin_bold,
            fontSize: VARS.fonts.size.body,
            lineHeight: 22,
            color: VARS.colors.white
        },
    },
    select: {
        wrapper: {
            flex: 0,
            width: '100%',
            position: 'relative',
            zIndex: 10,
        },
        button: {
            width: '100%',
        },
        button_inner: {
            width: '100%',
            flex: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        button_text: {
            fontFamily: VARS.fonts.family.darwin_light,
            fontSize: VARS.fonts.size.body,
            color: VARS.colors.navy.default,
            lineHeight: 22
        },
        dropdown: {
            position: Platform.OS === 'ios' ? 'absolute' : 'relative',
            zIndex: 20,
            top: Platform.OS === 'ios' ? 70 : 0,
            left: 0,
            width: '100%',
            backgroundColor: VARS.colors.white,
            paddingHorizontal: 10,
            paddingVertical: 10,
        },
        dropdown_option: {
            paddingVertical: 10,
        }
    },

    tab_bar: {
        height: {
            large: Platform.OS === 'ios' ? 85 : 80,
            small: Platform.OS === 'ios' ? 60 : 60
        }
    }
}

export const CSS = {
    body: {
        color: VARS.colors.navy.default,
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: VARS.fonts.size.body,
        whiteSpace: 'normal',
    },
    p: {
        marginBottom: 0,
        paddingBottom: 0,
        marginTop: 0,
        paddingTop: 0,
        lineHeight: 22,
    },
    strong: {
        fontFamily: VARS.fonts.family.darwin_bold,
        color: VARS.colors.purple.default
    }
}
