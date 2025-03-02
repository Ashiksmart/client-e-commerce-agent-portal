import { Stack, Avatar } from "@mui/material"
import _ from 'lodash'

export default function Attributes(props) {

    return <>
        {
            props?.attributes && props.attributes.map(t => {
                let ffff = props.selectedAttributes;
                const getValue = [];

                for (let i = 0; i < t.values.length; i++) {
                    const v = t.values[i];
                    const condition =
                        t.isImage === false
                            ? ffff[`${t.name}`] === v.value
                            : ffff[`${t.name}`] === v.value;

                    if (props.selectedAttributes) {
                        console.log(ffff[`${t.name}`], 'eeeeeeeeeeeeeeeeeeeeeeeeeee', t);
                    } else {
                        console.log('eeeeeeeeeeeeeeeeeeeeeeeeeee1');
                    }
                    console.log(v.value, '33333333333333333:', condition);

                    if (condition) {
                        getValue.push(v);
                    }
                }
                return (
                    <>
                        <div className="detail_separator"></div>
                        <Stack direction="row" spacing={1}>
                            <div className="btxt sub_txt">{`${t?.displayName}: `}</div>
                            {
                                t?.isImage === false && t?.isColor === false && getValue[0]?.label
                            }
                            {
                                (t?.isImage === true && t?.isColor === false) && getValue.map(v => {
                                    return (

                                        <div
                                            className={`productDetailColorCode dtl_col_box dtl_col_act`}
                                            sx={t.size} variant={t.variant}
                                        >
                                            <img
                                                className="dtl_col_ico"
                                                src={v.src}
                                                alt={""}
                                            />
                                        </div>
                                    )
                                })
                            }
                            {
                                (t?.isImage === false && t?.isColor === true) && getValue.map(v => {
                                    return (
                                        <div
                                            className={`productDetailColorCode dtl_col_box dtl_col_act`}
                                            sx={t.size} variant={t.variant}
                                            style={{ backgroundColor: v.value }}
                                        >
                                        </div>
                                    )
                                })
                            }
                        </Stack>
                    </>
                )

            })
        }

    </>
}