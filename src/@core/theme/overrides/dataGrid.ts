// ** Type Import
import { OwnerStateThemeType } from './'

const DataGrid = () => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          border: 0,
          color: theme.palette.text.primary,
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none'
          },
          '& .MuiDataGrid-withBorderColor': {
            borderColor: '#2C2D33'
          },
          '& .MuiDataGrid-virtualScroller': {
            overflowX: 'hidden',
            overflowY: 'scroll',
            // Style for Chrome, Edge, and Safari
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.primary.main,
            },
            // Style for Firefox
            scrollbarColor: `${theme.palette.primary.main} transparent`,
            scrollbarWidth: 'thin',

            // Add other browser-specific styles if necessary
          },
        }),
        toolbarContainer: ({ theme }: OwnerStateThemeType) => ({
          paddingRight: `${theme.spacing(6)} !important`,
          paddingLeft: `${theme.spacing(3.25)} !important`
        }),
        // columnHeaders: ({ theme }: OwnerStateThemeType) => ({
        //   backgroundColor: theme.palette.customColors.tableHeaderBg
        // }),
        columnHeader: ({ theme }: OwnerStateThemeType) => ({
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            '&:first-of-type': {
              paddingLeft: theme.spacing(6)
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(6)
          }
        }),
        columnHeaderCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        columnHeaderTitleContainer: {
          padding: 0,
        },
        columnHeaderTitle: ({ theme }: OwnerStateThemeType) => ({
          fontWeight: 600,
          letterSpacing: '1px',
          // textTransform: 'uppercase',
          fontSize: theme.typography.h6.fontSize
        }),
        columnSeparator: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.divider
        }),
        row: {
          '&:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 0
            }
          }
        },
        cell: ({ theme }: OwnerStateThemeType) => ({
          borderColor: theme.palette.divider,
          '&:not(.MuiDataGrid-cellCheckbox)': {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            '&:first-of-type': {
              paddingLeft: theme.spacing(6)
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(6)
          },
          '&:focus, &:focus-within': {
            outline: 'none'
          }
        }),
        cellCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        editInputCell: ({ theme }: OwnerStateThemeType) => ({
          padding: 0,
          color: theme.palette.text.primary,
          '& .MuiInputBase-input': {
            padding: 0
          }
        }),
        footerContainer: ({ theme }: OwnerStateThemeType) => ({
          borderTop: `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-toolbar': {
            paddingLeft: `${theme.spacing(4)} !important`,
            paddingRight: `${theme.spacing(4)} !important`
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel': {
            color: theme.palette.text.primary
          }
        }),
        selectedRowCount: ({ theme }: OwnerStateThemeType) => ({
          margin: 0,
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        })
      }
    }
  }
}

export default DataGrid
