import React from 'react'
import styles from './styles.module.scss'
import { Input, CheckBox } from '../../components/input'
import { Container, Padding } from '../../components/layout'

export const InputForm = ({
    children,
    className
}) => {

    return (
        <div className={className}>
            <Container full>
                <Padding>
                    {children}
                </Padding>
            </Container>
        </div>
    )
}

export const ModalInputForm = ({ children }) => {
    return (
        <table className={styles.inputTable}>
            <tbody>
                {children}
            </tbody>
        </table>
    )
}

export const ModalField = (props) => {
    return (
        <>
            <tr className={styles.inputrow + ' ' + (props.hint != null ? styles.withSub : '')}>
                <td className={styles.label}>{props.labelRow}</td>
                <td rowspan="2" className={styles.input + ' ' + props.classNames}>
                    {props.type === 'number' ?
                        <Input
                            {...props}
                        />
                        : props.type === 'checkbox' ?
                            <CheckBox
                                {...props}
                            />
                            :
                            props.children
                    }
                </td>
            </tr>
            {props.hint != null && <tr className={styles.subrow}>
                <td>
                    {props.hint}
                </td >
            </tr>}
        </>
    )
}