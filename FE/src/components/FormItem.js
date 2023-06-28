import React, { useContext, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { Button, Checkbox, DatePicker, Form, Input, Popover, Radio, Space, TimePicker, Typography, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/ko_KR';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const btob = [
    {label: '서은광', value: 'sek'}, 
    {label: '이민혁', value: 'lmh'}, 
    {label: '이창섭', value: 'lcs'}, 
    {label: '임현식', value: 'ihs'}, 
    {label: '프니엘', value: 'sdg'}, 
    {label: '육성재', value: 'ysj'}, 
];
const dayList = [
    {label: '월', value: '2'}, 
    {label: '화', value: '3'}, 
    {label: '수', value: '4'}, 
    {label: '목', value: '5'}, 
    {label: '금', value: '6'}, 
    {label: '토', value: '7'}, 
    {label: '일', value: '1'}, 
];
const weekList = [
    {label: '첫째주', value: '1'}, 
    {label: '둘째주', value: '2'}, 
    {label: '셋째주', value: '3'}, 
    {label: '넷째주', value: '4'}, 
    {label: '마지막주', value: '5'}, 
];
const typePopover = (
    <div className="popover-wrap">
        <p><span>스케줄</span><br/>방송, 라디오, 행사 등의 스케줄을 등록해요</p>
        <p><span>고정 스케줄</span><br/>매월 1일에 다음달 스케줄을 자동으로 생성해요<br/>스케줄이 만들어진 후에는 고정 스케줄의 내용을 수정해도 만들어진 스케줄에는 반영되지 않아요</p>
        <p><span>기념일</span><br/>생일, 데뷔기념일을 제외한 기념일을 등록해요<br/>한 해의 마지막날 다음해의 생일과 데뷔기념일이 자동으로 생성돼요</p>
    </div>
);
const periodPopover = (
    <div className="popover-wrap">
        <ul>
            <li>종료일 선택 체크박스에 체크하고 날짜를 선택하지 않아도 값이 입력될 수 있어요<br/><strong>종료일을 지정하고 싶을 때만</strong> 체크박스를 선택해 주세요</li>
            <li>고정 스케줄을 수정할 때는 기간을 수정해도 스케줄이 생성되지 않아요<br/>한 번 생성된 고정 스케줄은 매월 1일에만 동작해요</li>
        </ul>
    </div>
);

const FormItem = (props) => {
    const [spinner, setSpinnerShow] = useOutletContext();
    const auth = useContext(AuthContext);

    // 수정 팝업 닫기
    const modelClose = props.cancel;
    const navigate = useNavigate();
    
    const id = props.id ? props.id : null;
    const [form] = Form.useForm();

    const modify = props.modify ? props.modify : false;
    const create = props.create ? props.create : false;

    const reloadFunction = props.reloadFunction ? props.reloadFunction : null;
    const selectDate = props.selectDate ? props.selectDate : null;
    const dateTitle = props.dateTitle ? props.dateTitle : null;

    // 수정 시 선택항목
    const sType = props.type ? props.type : 'S';
    const selectItems = props.selectItems ? props.selectItems : null;
    const selectedMember = [];
    if(!modify || selectItems.sek === 'Y') selectedMember.push("sek");
    if(!modify || selectItems.lmh === 'Y') selectedMember.push("lmh");
    if(!modify || selectItems.lcs === 'Y') selectedMember.push("lcs");
    if(!modify || selectItems.ihs === 'Y') selectedMember.push("ihs");
    if(!modify || selectItems.sdg === 'Y') selectedMember.push("sdg");
    if(!modify || selectItems.ysj === 'Y') selectedMember.push("ysj");
    const selectDay = modify && selectItems.day ? selectItems.day : '';
    const selectedDay = selectDay.split('');
    const selectWeek = modify && selectItems.week ? selectItems.week : '';
    const selectedWeek = selectWeek.split('');
    const selectRepeat = selectWeek === '' ? 'week' : 'month';


    // 스케줄 구분
    const [typeSched, setSelectSched] = useState(sType === 'S');
    const [typeFixed, setSelectFixed] = useState(sType === 'F');
    const [typeAnniv, setSelectAnniv] = useState(sType === 'A');
    const onTypeChange = (e) => {
        setSelectSched(e.target.value === "S");
        setSelectFixed(e.target.value === "F");
        setSelectAnniv(e.target.value === "A");
    }

    // 반복 구분
    const [repeatMonth, setRepeatMonth] = useState(selectRepeat === 'month');
    const onRepeatChange = (e) => {
        setRepeatMonth(e.target.value === 'month');
    }

    // 스케줄 카테고리
    const [categoryList, setCategory] = useState(JSON.parse(window.sessionStorage.getItem("category")).list);

    // datepicker 선택 불가
    const [rangeStartDate, setRangeStartDate] = useState(modify ? dayjs(selectItems.startDate, 'YYYY-MM-DD') : null);
    const [rangeEndDate, setRangeEndDate] = useState(modify  && selectItems.endDate ? dayjs(selectItems.endDate, 'YYYY-MM-DD') : null);
    const disableDate = (current) => {
        return current && current < dayjs('2012-01-01', 'YYYY-MM-DD');
    }
    const disableRangeStart = (current) => {
        if(rangeEndDate) {
            return rangeEndDate && rangeEndDate.diff(current, 'days') <= 0;
        } else {
            return current && current < dayjs('2012-01-01', 'YYYY-MM-DD');
        }
    }
    const disableRangeEnd = (current) => {
        return rangeStartDate && rangeStartDate.diff(current, 'days') >= 0;
    }

    /* 종료일 선택 */
    const [periodEnd, setPeriodEnd] = useState(modify && selectItems.endDate ? true : false);
    const [endDateSelect, setEndDateSelect] = useState(!periodEnd);
    const changePeriodEnd = (e) => {
        setPeriodEnd(e.target.checked);
        setEndDateSelect(!e.target.checked);
    }


    /* 저장 */
    const onFinish = (values) => {
        submitForm(values, id);
    }
    async function submitForm(values, id){
        setSpinnerShow(true);

        let eventData = {};
        const scheduleMember = values.member;
        switch(values.type) {
            case 'F':
                eventData = {
                    scheduleId: id,
                    scheduleType: values.type,
                    scheduleCategory: values.category,
                    scheduleEk: scheduleMember.includes('sek') ? 'Y' : 'N',
                    scheduleMh: scheduleMember.includes('lmh') ? 'Y' : 'N',
                    scheduleCs: scheduleMember.includes('lcs') ? 'Y' : 'N',
                    scheduleHs: scheduleMember.includes('ihs') ? 'Y' : 'N',
                    scheduleDg: scheduleMember.includes('sdg') ? 'Y' : 'N',
                    scheduleSj: scheduleMember.includes('ysj') ? 'Y' : 'N',
                    scheduleStartDate: dayjs(values.startDate).format('YYYY-MM-DD'),
                    scheduleEndDate: values.periodEnd ? dayjs(values.endDate).format('YYYY-MM-DD') : null,
                    scheduleDay: values.day.sort().join(''),
                    scheduleTime: dayjs(values.time).format('HH:mm'),
                    scheduleTitle: values.title,
                    scheduleNote: values.note,
                    scheduleWeek: values.repeat === 'month' ? values.week.sort().join('') : null,
                }
                break;
            case 'A':
                eventData = {
                    scheduleId: id,
                    scheduleType: values.type,
                    scheduleDate: dayjs(values.date).format('YYYY-MM-DD'),
                    scheduleTitle: values.title,
                    scheduleNote: values.note,
                    scheduleLink: values.link,
                }
                break;
            case 'S':
            default:
                eventData = {
                    scheduleId: id,
                    scheduleType: values.type,
                    scheduleCategory: values.category,
                    scheduleEk: scheduleMember.includes('sek') ? 'Y' : 'N',
                    scheduleMh: scheduleMember.includes('lmh') ? 'Y' : 'N',
                    scheduleCs: scheduleMember.includes('lcs') ? 'Y' : 'N',
                    scheduleHs: scheduleMember.includes('ihs') ? 'Y' : 'N',
                    scheduleDg: scheduleMember.includes('sdg') ? 'Y' : 'N',
                    scheduleSj: scheduleMember.includes('ysj') ? 'Y' : 'N',
                    scheduleDate: dayjs(values.date).format('YYYY-MM-DD'),
                    scheduleTime: dayjs(values.time).format('HH:mm'),
                    scheduleTitle: values.title,
                    scheduleNote: values.note,
                    scheduleLink: values.link,
                }
                break;
        }

        let url;
        let method;
        if(!modify) {
            url = process.env.REACT_APP_BACKEND_URL + '/schedule/save';
            method = 'POST';
        } else {
            url = process.env.REACT_APP_BACKEND_URL + '/schedule/update';
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
            body: JSON.stringify(eventData)
        });

        if(!response.ok) {
            message.warning('오류가 발생했어요');
        } else {
            const result = await response.json();
            if(result && result.status === 'OK'){
                if(modify) {
                    message.success('수정되었어요');
                    modelClose();
                    if(selectDate) {
                        reloadFunction(selectDate, dateTitle);
                    }
                    navigate();
                } else if(create) {
                    message.success('저장되었어요');
                    modelClose();
                    if(selectDate) {
                        reloadFunction(selectDate, dateTitle);
                    }
                } else {
                    message.success('저장되었어요');
                    navigate('/');
                }
            } else {
                message.warning('오류가 발생했어요');
            }
        }

        setSpinnerShow(false);
    }

    return (
        <div className="form-wrap">
            {!modify && !create ?
                <h3>스케줄 추가</h3>
                : null
            }
            <Form
                layout='horizontal'
                name="schedule"
                autoComplete="off"
                labelCol={{span: 4}}
                wrapperCol={{span: 20}}
                style={{maxWidth: 600}}
                colon={false}
                method='POST'
                action='/form'
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label="구분"
                >
                    <div className="form-flex">
                        <Form.Item
                            name="type"
                            initialValue={sType ? sType : 'S'}
                        >
                            <Radio.Group defaultValue={sType ? sType : 'S'} buttonStyle="solid" onChange={onTypeChange} disabled={modify}>
                                <Radio.Button value="S" checked={typeSched}>스케줄</Radio.Button>
                                <Radio.Button value="F" checked={typeFixed}>고정 스케줄</Radio.Button>
                                <Radio.Button value="A" checked={typeAnniv}>기념일</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Popover title="구분" content={typePopover}>
                            <Typography.Link className="type-popover"><InfoCircleOutlined/></Typography.Link>
                        </Popover>
                    </div>
                </Form.Item>
                {!typeAnniv ?
                    <React.Fragment>
                        <Form.Item
                            label="카테고리"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: '카테고리를 선택해 주세요'
                                }
                            ]}
                            initialValue={modify ? selectItems.category : null}
                        >
                            <Radio.Group optionType='default' defaultValue={modify ? selectItems.category : null}>
                                {categoryList.map(cate => 
                                    <Radio.Button value={cate.code}>{cate.name}</Radio.Button>
                                )}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="멤버"
                            name="member"
                            initialValue={selectedMember}
                            valuePropName='checked'
                        >
                            <Checkbox.Group options={btob} defaultValue={selectedMember}/>
                        </Form.Item>
                    </React.Fragment>
                : null
                }
                {!typeFixed ?
                <Form.Item
                    label="날짜"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: '날짜를 선택해 주세요'
                        }
                    ]}
                    initialValue={modify ? dayjs(selectItems.date, 'YYYY-MM-DD') : (create ? dayjs(selectDate, 'YYYY년 MM월 DD일') : null)}
                >
                    <DatePicker 
                        placeholder='YYYY-MM-DD' 
                        defaultValue={modify ? dayjs(selectItems.date, 'YYYY-MM-DD') : (create ? dayjs(selectDate, 'YYYY년 MM월 DD일') : null)}
                        disabledDate={disableDate}
                        inputReadOnly={true}
                        locale={locale}/>
                </Form.Item>
                :
                <React.Fragment>
                    <Form.Item
                        label="기간"
                        rules={[
                            {required: true}
                        ]}
                    >
                        <Space.Compact block>
                            <Form.Item
                                name="startDate"
                                rules={[
                                    {
                                        required: true,
                                        message: '기간을 선택해 주세요'
                                    }
                                ]}
                                initialValue={modify ? rangeStartDate : null}
                            >
                                <DatePicker 
                                    placeholder='YYYY-MM-DD' 
                                    defaultValue={rangeStartDate}
                                    disabledDate={disableRangeStart}
                                    onChange={(val) => setRangeStartDate(val)}
                                    locale={locale}
                                    disabled={modify}
                                    inputReadOnly={true}
                                    />
                            </Form.Item>
                            <Input
                                className="site-input-split"
                                style={{
                                    width: 24,
                                    borderLeft: 0,
                                    borderRight: 0,
                                    pointerEvents: 'none',
                                    backgroundColor: 'white',
                                    height: 'fit-content',
                                }}
                                placeholder="~"
                                disabled
                            />
                            <Form.Item
                                name="endDate"
                                initialValue={rangeEndDate ? rangeEndDate : undefined}
                                style={{marginRight: 10}}
                            >
                                <DatePicker 
                                    placeholder='YYYY-MM-DD' 
                                    defaultValue={rangeEndDate}
                                    disabledDate={disableRangeEnd}
                                    onChange={(val) => setRangeEndDate(val)}
                                    locale={locale}
                                    style={{borderLeft: 'none'}}    
                                    inputReadOnly={true}
                                    disabled={endDateSelect}
                                />
                            </Form.Item>
                        </Space.Compact>
                        <div className="form-flex">
                            <Form.Item
                                name="periodEnd"
                                initialValue={periodEnd}
                                valuePropName='checked'
                            >
                                <Checkbox onChange={changePeriodEnd}>종료일 선택</Checkbox>
                            </Form.Item>
                            <Popover title="구분" content={periodPopover} className="close">
                                <Typography.Link className="type-popover"><InfoCircleOutlined/></Typography.Link>
                            </Popover>
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="반복"
                        name="repeat"
                        rules={[
                            {
                                required: true,
                                message: '반복 구분을 선택해 주세요'
                            }
                        ]}
                        initialValue={selectRepeat}
                    >
                        <Radio.Group onChange={onRepeatChange} defaultValue={selectRepeat}>
                            <Radio value="week" checked={!repeatMonth}>매주</Radio>
                            <Radio value="month" checked={repeatMonth}>매달</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {repeatMonth && 
                        <Form.Item
                            label="반복주"
                            name="week"
                            rules={[
                                {
                                    required: true,
                                    message: '반복할 주를 선택해 주세요'
                                }
                            ]}
                            initialValue={selectedWeek}
                            valuePropName='checked'
                        >
                            <Checkbox.Group options={weekList} defaultValue={selectedWeek} style={{gap: 2}}/>
                        </Form.Item>
                    }
                    <Form.Item
                        label="요일"
                        name="day"
                        rules={[
                            {
                                required: true,
                                message: '요일을 선택해 주세요'
                            }
                        ]}
                        initialValue={selectedDay}
                        valuePropName='checked'
                    >
                        <Checkbox.Group options={dayList} defaultValue={selectedDay} style={{gap: 2}}/>
                    </Form.Item>
                </React.Fragment>
                }
                {!typeAnniv ?
                    <Form.Item
                        label="시간"
                        name="time"
                        rules={[
                            {
                                required: true,
                                message: '시간을 선택해 주세요'
                            }
                        ]}
                        initialValue={modify ? dayjs(selectItems.time, 'HH:mm') : null}
                    >
                        <TimePicker 
                            placeholder='HH:mm' 
                            format='HH:mm' 
                            defaultValue={modify ? dayjs(selectItems.time, 'HH:mm') : null}
                            locale={locale} 
                            inputReadOnly={true}
                            showNow={false}/>
                    </Form.Item>
                    : null
                }
                <Form.Item
                    label="제목"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: '제목을 입력해 주세요'
                        }
                    ]}
                    initialValue={modify ? selectItems.title : null}
                >
                    <Input defaultValue={modify ? selectItems.title : null} allowClear/>
                </Form.Item>
                <Form.Item
                    label="참고"
                    name="note"
                    initialValue={modify ? selectItems.note : null}
                >
                    <Input defaultValue={modify ? selectItems.note : null} />
                </Form.Item>
                {!typeFixed ?
                    <Form.Item
                        label="링크"
                        name="link"
                        help="유튜브, 트위터 등의 링크를 연결해요"
                        initialValue={modify ? selectItems.link : null}
                    >
                        <Input defaultValue={modify ? selectItems.link : null} allowClear/>
                    </Form.Item>
                    : null
                }
                {modify ? 
                    <div className="form-button-list">
                        <Form.Item className="form-button">
                            <Button type="default" htmlType='button' onClick={modelClose}>취소</Button>
                            <Button type="primary" htmlType='submit' >수정</Button>
                        </Form.Item>
                    </div> 
                    : 
                    create ?
                    <div className="form-button-list">
                        <Form.Item className="form-button">
                            <Button type="default" htmlType='button' onClick={modelClose}>취소</Button>
                            <Button type="primary" htmlType='submit' >저장</Button>
                        </Form.Item>
                    </div> 
                    : <Form.Item className="form-button"><Button type="primary" htmlType='submit'>저장</Button></Form.Item>
                }
            </Form>
        </div>
    )
}

export default FormItem;
