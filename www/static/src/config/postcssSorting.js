/**
 * @file post-css sort config
 * @author liuliang<liuliang@kavout.com>
 */

module.exports = {
    'properties-order': [
        'content',

        'order',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'flex',
        'align-self',

        'display',
        'flex-direction',
        'flex-wrap',
        'flex-flow',
        'justify-content',
        'align-items',
        'align-content',

        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',
        'clear',
        'float',
        'overflow',
        'overflow-x',
        'overflow-y',
        'overflow-wrap',
        'overflow-scrolling',
        'clip',
        'visibility',

        'box-sizing',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'border',
        'border-width',
        'border-style',
        'border-color',
        'border-radius',
        'border-top',
        'border-top-width',
        'border-top-style',
        'border-top-color',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-right',
        'border-right-width',
        'border-right-style',
        'border-right-color',
        'border-bottom',
        'border-bottom-width',
        'border-bottom-style',
        'border-bottom-color',
        'border-bottom-right-radius',
        'border-bottom-left-radius',
        'border-left',
        'border-left-width',
        'border-left-style',
        'border-left-color',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',


        'font',
        'font-style',
        'font-weight',
        'font-size',
        'font-family',
        'font-smoothing',
        'src',
        'line-height',

        'text-indent',
        'text-align',
        'text-decoration',
        'text-transform',
        'text-shadow',
        'text-overflow',
        'text-size-adjust',
        'letter-spacing',
        'word-spacing',
        'word-wrap',
        'white-space',
        'list-style',

        'background',
        'background-color',
        'background-image',
        'background-repeat',
        'background-attachment',
        'background-position',
        'background-clip',
        'background-origin',
        'background-size',
        'color',
        'opacity',
        'box-shadow',
        'filter',


        'caption-side',
        'table-layout',
        'empty-cells',

        'cursor',
        'outline',
        'pointer-events',

        'animation',
        'tranisition'
    ],
    'order': [
        'custom-properties',
        'dollar-variables',
        'declarations',
        {
            type: 'rule',
            selector: '^a'
        },
        {
            type: 'rule',
            selector: /^&/
        },
        {
            type: 'rule',
            selector: /^&:\w/
        },
        'rules',
        {
            type: 'at-rule',
            name: 'charset'
        },
        {
            type: 'at-rule',
            name: 'block'
        },
        {
            type: 'at-rule',
            name: 'font-face'
        },
        {
            type: 'at-rule',
            name: 'font-face',
            hasBlock: true
        },
        {
            type: 'at-rule',
            name: 'extend'
        },
        {
            type: 'at-rule',
            name: 'media',
            hasBlock: true
        },
        {
            type: 'at-rule'
        }
    ]

};
