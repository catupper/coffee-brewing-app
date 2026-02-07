import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        coffee: {
            main: string;
            light: string;
            dark: string;
            cream: string;
            caramel: string;
        };
    }
    interface PaletteOptions {
        coffee?: {
            main: string;
            light: string;
            dark: string;
            cream: string;
            caramel: string;
        };
    }
}

const coffeeColors = {
    mocha: '#A47764',
    darkRoast: '#5C3408',
    latte: '#FAF6F1',
    espresso: '#1A1410',
    cream: '#F8DD98',
    caramel: '#B1741B',
    bean: '#2C1810',
    mediumRoast: '#8D6E63',
    warmGray: '#EFEBE9',
};

const theme = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: coffeeColors.mocha,
                    dark: coffeeColors.darkRoast,
                    light: '#C4A48E',
                    contrastText: '#FFFFFF',
                },
                secondary: {
                    main: coffeeColors.caramel,
                    light: coffeeColors.cream,
                    dark: '#8B5A00',
                    contrastText: '#FFFFFF',
                },
                background: {
                    default: coffeeColors.latte,
                    paper: '#FFFFFF',
                },
                text: {
                    primary: coffeeColors.bean,
                    secondary: coffeeColors.mediumRoast,
                },
                error: {
                    main: '#C62828',
                },
                success: {
                    main: '#558B2F',
                    light: '#C5E1A5',
                },
                coffee: {
                    main: coffeeColors.mocha,
                    light: coffeeColors.warmGray,
                    dark: coffeeColors.darkRoast,
                    cream: coffeeColors.cream,
                    caramel: coffeeColors.caramel,
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#C4A48E',
                    dark: coffeeColors.mocha,
                    light: '#DCC8B8',
                    contrastText: '#1A1410',
                },
                secondary: {
                    main: coffeeColors.cream,
                    light: '#FBE9B0',
                    dark: coffeeColors.caramel,
                    contrastText: '#1A1410',
                },
                background: {
                    default: '#1A1410',
                    paper: '#2C2218',
                },
                text: {
                    primary: '#F5EDE6',
                    secondary: '#C4A48E',
                },
                error: {
                    main: '#EF5350',
                },
                success: {
                    main: '#81C784',
                    light: '#388E3C',
                },
                coffee: {
                    main: '#C4A48E',
                    light: '#3D3028',
                    dark: coffeeColors.mocha,
                    cream: '#F8DD98',
                    caramel: '#D4952A',
                },
            },
        },
    },
    typography: {
        fontFamily: "'Noto Sans JP', 'Inter', sans-serif",
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        body2: {
            lineHeight: 1.7,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
            defaultProps: {
                elevation: 0,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme: t }) => ({
                    border: `1px solid ${alpha(t.palette.divider, 0.08)}`,
                    backdropFilter: 'blur(8px)',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }),
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 10,
                    padding: '8px 20px',
                },
                contained: ({ theme: t }) => ({
                    boxShadow: `0 2px 8px ${alpha(t.palette.primary.main, 0.25)}`,
                    '&:hover': {
                        boxShadow: `0 4px 16px ${alpha(t.palette.primary.main, 0.35)}`,
                    },
                }),
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: ({ theme: t }) => ({
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '10px !important',
                    border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
                    '&.Mui-selected': {
                        backgroundColor: alpha(t.palette.primary.main, 0.12),
                        color: t.palette.primary.main,
                        borderColor: t.palette.primary.main,
                        fontWeight: 700,
                        '&:hover': {
                            backgroundColor: alpha(t.palette.primary.main, 0.18),
                        },
                    },
                }),
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: ({ theme: t }) => ({
                    border: `1px solid ${alpha(t.palette.divider, 0.08)}`,
                    '&::before': {
                        display: 'none',
                    },
                    '&.Mui-expanded': {
                        margin: 0,
                    },
                }),
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                },
                head: ({ theme: t }) => ({
                    backgroundColor: alpha(t.palette.primary.main, 0.08),
                    fontWeight: 700,
                    color: t.palette.text.primary,
                }),
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme;
