import React, { useContext, useState } from 'react';

import { Button, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import FormItem from './FormItem';
import { AuthContext } from '../context/auth-context';

const ScheduleItem = (props) => {
    const auth = useContext(AuthContext);

    const fixed = props.fixed != null ? props.fixed : false;
    const sched = props.sched != null ? props.sched : true;
    const id = props.id ? props.id : null;
    const type = props.type ? props.type : null;
    const day = props.day ? props.day : null;
    const week = props.week ? props.week : null;
    const date = props.date ? props.date : null;
    const time = props.time ? props.time : null;
    const title = props.title ? props.title : null;
    const category = props.category ? props.category : null;
    const categoryName = props.categoryName ? props.categoryName : null;
    const note = props.note ? props.note : null;
    const link = props.link ? props.link : null;
    const sek = props.sek ? props.sek : 'N';
    const lmh = props.lmh ? props.lmh : 'N';
    const lcs = props.lcs ? props.lcs : 'N';
    const ihs = props.ihs ? props.ihs : 'N';
    const sdg = props.sdg ? props.sdg : 'N';
    const ysj = props.ysj ? props.ysj : 'N';
    const deleteFunction = props.delete ? props.delete : null;
    const reloadFunction = props.reloadFunction ? props.reloadFunction : null;
    const selectDate = props.selectDate ? props.selectDate : null;
    const dateTitle = props.dateTitle ? props.dateTitle : null;

    const [updateOpen, setUpdateModalOpen] = useState(false);

    let cateStyle;
    try {
        const categoryItems = JSON.parse(window.sessionStorage.getItem("category")).list;
    
        const categoryStyles = new Map();
        categoryItems.map(cate => {
            let border, padding;
            if(cate.background.toLowerCase().startsWith('#fff') || cate.background === 'white') {
                border = `2px solid ${cate.color}`
                padding = '0px 8px'
            }
            categoryStyles.set(cate.code, {color: cate.color, backgroundColor: cate.background, border: border, padding: padding});
        });

        cateStyle = categoryStyles.get(category);

    } catch(error) {
        message.warning('오류가 발생했어요');
    }

    // 수정 팝업
    const showUpdateModal = async () => {
        await fetchSelectItems();
        setUpdateModalOpen(true);
    }
    const clickCancelUpdateModal = () => {
        setUpdateModalOpen(false);
    };

    // 삭제 컨펌
    const showDeleteModal = () => {
        Modal.confirm({
            title: '스케줄 삭제',
            content: <span>정말로 삭제하시겠어요?</span>,
            okText: "삭제",
            cancelText: "취소",
            closable: false,
            maskClosable: true,
            width: 300,
            centered: true,
            onOk: deleteOk,
        });
    };

    const deleteOk = () => {
        deleteFunction(id, type);
    }

    // 링크 열기
    const openWindow = () => {
        window.open(link, '_blank');
    }
    
    const [selectItems, setSelectItems] = useState({});
    const fetchSelectItems = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/schedule/info?id=${id}&type=${type}`, {method: 'GET'});

            if(!response.ok) {
                message.warning('오류가 발생했어요');
            } else {
                const data = await response.json();
                
                switch(type) {
                    case 'F':
                        setSelectItems(data.fixed);
                        break;
                    case 'A':
                        setSelectItems(data.anniversary);
                        break;
                    case 'S':
                    default:
                        setSelectItems(data.schedule);
                        break;
                }
            }
        } catch(error) {
            message.warning('오류가 발생했어요');
        }
    }

    const ButtonList = (props) => {
        return (
            <div className="edit-button-list">
                <Button type="link" size="small" shape="circle" onClick={showUpdateModal} icon={<EditOutlined/>} />
                <Modal 
                    title="스케줄 수정" 
                    open={updateOpen} 
                    bodyStyle={{maxHeight: 500, overflow: 'auto'}}
                    maskClosable={false}
                    closable={false}
                    centered={true}
                    footer={null}
                >
                    <FormItem 
                        modify={true} 
                        id={id} 
                        type={type} 
                        selectItems={selectItems} 
                        cancel={clickCancelUpdateModal} 
                        reloadFunction={reloadFunction} 
                        selectDate={selectDate}
                        dateTitle={dateTitle}/>
                </Modal>
                {deleteFunction && 
                <Button type="link" size="small" shape="circle" onClick={showDeleteModal} icon={<DeleteOutlined/>} />}
            </div>
        )
    };

    if(fixed) {
        return (
            <div className="schedule-wrap">
                <React.Fragment>
                    <div className="schedule-time">{week ? <>{week}<br/></> : (day === '매일' ? null : <>매주<br/></>)}{day}<br/>{time}</div>
                    <div className="schedule-content">
                        <div className="schedule-feature">
                            <div className="schedule-category" style={cateStyle}>{categoryName}</div>
                            <div className="schedule-member">
                                {sek === 'Y' && '😺'}
                                {lmh === 'Y' && '🐿️'}
                                {lcs === 'Y' && '🍑'}
                                {ihs === 'Y' && '🐻'}
                                {sdg === 'Y' && '🐧'}
                                {ysj === 'Y' && '🦊'}
                            </div>
                        </div>
                        <div className="schedule-main">
                            <div className="schedule-title">{title}</div>
                            {link ?
                                <Button className="link-button" type="link" size="small" shape="circle" onClick={openWindow} icon={<LinkOutlined/>} />
                                : null
                            }
                            {id && auth.isLoggedIn ? <ButtonList id={id} type={type}/> : null}
                        </div>
                        {note ? 
                            <div className="schedule-note">{note}</div>
                            : null
                        }
                    </div>
                </React.Fragment>
            </div>
        )
    } else {
        return (
            <div className="schedule-wrap" style={props.style}>
                <React.Fragment>
                    {sched ?
                        <div className="schedule-time">{time}</div>
                        : null
                    }
                    <div className="schedule-content">
                        {sched ?
                            <div className="schedule-feature">
                                <div className="schedule-category" style={cateStyle}>{categoryName}</div>
                                <div className="schedule-member">
                                    {sek === 'Y' && '😺'}
                                    {lmh === 'Y' && '🐿️'}
                                    {lcs === 'Y' && '🍑'}
                                    {ihs === 'Y' && '🐻'}
                                    {sdg === 'Y' && '🐧'}
                                    {ysj === 'Y' && '🦊'}
                                </div>
                            </div>
                            : null
                        }
                        <div className="schedule-main">
                            <div className="schedule-title">{title}</div>
                            {link ?
                                <Button className="link-button" type="link" size="small" shape="circle" onClick={openWindow} icon={<LinkOutlined/>} />
                                : null
                            }
                            {id && auth.isLoggedIn ? <ButtonList id={id} type={type}/> : null}
                        </div>
                        {note ? 
                            <div className="schedule-note">{note}</div>
                            : null
                        }
                    </div>
                </React.Fragment>
            </div>
        )
    }
}

export default ScheduleItem;