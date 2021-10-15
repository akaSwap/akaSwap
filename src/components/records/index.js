import React from 'react'
// import { ReactComponent as ToggleIcon } from './img/toggle.svg'
import styles from './styles.module.scss'
import { getLanguage } from '../../constants'
import { Container, Padding } from '../layout'


const language = getLanguage()
// export const RecordsToggle = (
//     getRecordsCB = () => null
// ) => {
//     const [records, setRecords] = useState([])
//     const showRecords = () => {
//         setRecords(getRecordsCB())
//     }
//     if (records.length > 0) {
//         return (
//             <Container large>
//                 <Padding>
//                     <div className={styles.recordList}>
//                         <Records
//                             records={records}
//                         />
//                     </div>
//                 </Padding>
//             </Container>
//         )
//     } else {
//         return (
//             <div className={styles.showRecordListButton}>
//                 <button onClick={showRecords()}>
//                     Show Records <ToggleIcon />
//                 </button>
//             </div>
//         )
//     }
// }

export const RecordListContainer = ({ children }) => (
    <Padding>
        <div className={styles.recordList}>
            {children}
        </div>
    </Padding>
)

export const RecordsList = ({
    records = null,
    title,
    grids,
    rwdGrids,
    rowSpans
}) => {
    const RecordItem = (cols, i) => {
        const RecordItemCol = ({ text, link }, i) => {
            var style = {
                '--colWidth': (grids && grids[i + 1]) ? grids[i + 1] : 1,
                '--colWidthRWD': (rwdGrids && rwdGrids[i + 1]) ? rwdGrids[i + 1] : 1,
                '--rowSpan': (rowSpans && rowSpans[i]) ? rowSpans[i] : 1
            }
            if (link) {
                return (<a className={styles.col} style={style} href={link} key={i}>
                    <label>{text}</label>
                </a>)
            } else {
                return <label className={styles.col} style={style} key={i}>{text}</label>
            }
        }

        var style = {
            '--colFr': (grids && grids[0]) ? grids[0] : cols.length,
            '--colFrRWD': (rwdGrids && rwdGrids[0]) ? rwdGrids[0] : cols.length,
        }
        return (
            <div className={styles.recordItem} key={i}>
                <div className={styles.item} style={style}>
                    {cols.map((col, i) => RecordItemCol(col, i))}
                </div>
            </div>
        )
    }
    return (
        <>
            <Container full>
                <Padding>
                    <div>{title ? title : language.detail.records.title}</div>
                </Padding>
            </Container>
            {records != null &&
                <Container full>
                    <Padding>
                        {records.map((record, i) => RecordItem(record, i))}
                    </Padding>
                </Container>
            }
        </>
    )
}