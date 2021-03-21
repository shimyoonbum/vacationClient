import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Table, Button, Modal, Container, Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const GlobalStyle = createGlobalStyle`
  body {
    margin : 100px 20px 20px;
    background : #dedede;
  }
`;

const Block = styled.div`
    padding : 30px 40px;
    margin : 10px;
    background : #fff;
    border-radius : 10px;
    box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.3);
`;

const ApplyPage = () => {
    const [show, setShow] = useState(false);
    const [code, setCode] = useState({value: 'select'});
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [countDate, setCountDate] = useState(new Date());

    const handleClose = () => {
        let json = {
            "va_start_date" : getFormatDate(startDate),
            "va_end_date"	:  getFormatDate(endDate),
            "va_days_num"	: countDate,
            "vk_code"		: code,
            "va_reason"		: reason
        };

        console.log(json);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const doApply = (e) => {
        e.preventDefault(); // submit이 action을 안타고 자기 할일을 그만함.

        let json = {
            "va_start_date" : startDate,
            "va_end_date"	: endDate,
            "va_days_num"	: countDate,
            "vk_code"		: code,
            "va_reason"		: reason
        };

        console.log(json);
        
        if(countDate < 0.5){
            window.alert("시작날짜가 종료일자보다 미래일 수 없습니다.")
            return;
        }   
    };

    /**
     *  yyyyMMdd 포맷으로 반환
     */
    const getFormatDate = (date) => {
        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate();                   //d
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        return  year + '' + month + '' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
    }

    useEffect(() => {
        calDate();        
    }, [startDate, endDate, countDate])

    const calDate = () => {
        //휴가일수 계산
        var dateDiff = Math.ceil((endDate.getTime()-startDate.getTime())/(1000*3600*24)+1);  
        // 사이에 낀 토,일 제외하기 위한 로직
        var weeks = Math.floor(dateDiff / 7);
        var dateDiff = dateDiff - (weeks * 2);  
        //일요일 : 0, 토요일 : 6
        var startDay = startDate.getDay();
        var endDay = endDate.getDay();
        // 지난 토, 일 제거(목 ~ 월 인 경우)
        if (startDay - endDay > 1)
           var dateDiff = dateDiff - 2;
        // 시작일 제거
        if (startDay == 0 && endDay != 6)
            var dateDiff = dateDiff - 1;            
        // 종료일 제거
        if (endDay == 6 && startDay != 0)
            var dateDiff = dateDiff - 1;        
        //일자 state에 반영
        setCountDate(parseInt(dateDiff));
    }

    const changeSelect = (select_obj) => {
        // 우선 selectbox에서 선택된 index를 찾고 
        var selected_index = select_obj.selectedIndex;
        // 선택된 index의 value를 찾고 
        var selected_value = select_obj.options[selected_index].value;
        // 원하는 동작을 수행한다. 여기서는 그냥 alert해주는 식으로만 처리함. 
        alert(selected_value);
    }

    return (
        <Container>
            <GlobalStyle />
            <Header /> 
            <Block>
                <h3>휴가 신청</h3>
                <hr/>

                <Table striped bordered hover style={{textAlign : 'center'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>회사명</th>
                            <th>직급</th>
                            <th>입사일자</th>
                            <th>상위자</th>
                            <th>남은 휴가일수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>mdo</td>
                            <td>qqe</td>
                            <td>15.0</td>
                        </tr>
                    </tbody>
                </Table>

                <Button variant="secondary" onClick={handleShow}>신규 신청</Button>
            </Block> 
            <Block>
                <h3>휴가 신청 내역</h3>
                <hr/>

                <Table striped bordered hover style={{textAlign : 'center'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>회사명</th>
                            <th>직급</th>
                            <th>입사일자</th>
                            <th>상위자</th>
                            <th>남은 휴가일수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>mdo</td>
                            <td>qqe</td>
                            <td>15.0</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>mdo</td>
                            <td>qqe</td>
                            <td>15.0</td>
                        </tr>
                    </tbody>
                </Table>
            </Block>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>휴가 신규 신청</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={doApply}> 
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>휴가 유형</Form.Label>
                        <Form.Control value={code} 
                        as="select" onChange={changeSelect}>

                            <option value="select">연차</option>
                            <option value="select2">반차</option>

                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>휴가 기간</Form.Label>
                        <div style={{display : 'flex', textAlign : 'center'}}>                            
                            <div style={{flex : 1}}>
                            시작 <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                style={{border: '1px solid #ced4da', borderRadius: '.25rem'}}
                            />
                            </div>
                            <div style={{flex : 1 }}>
                            종료 <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                style={{border: '1px solid #ced4da', borderRadius: '.25rem'}}
                            />
                            </div>
                        </div>                       
                        
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>휴가 일수</Form.Label>
                        <Form.Control type="text" placeholder="일수" value={countDate} disabled/>
                    </Form.Group>
                    
                    {/* <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>포함 공휴일</Form.Label>
                        <Form.Control type="text" placeholder="공휴일" disabled/>
                    </Form.Group> */}

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>휴가 사유</Form.Label>
                        <Form.Control as="textarea" rows={3} value={reason} 
                        onChange={e => setReason(e.target.value)}/>
                    </Form.Group>                  

                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    취소
                </Button>
                <Button type="submit" variant="primary" >
                    신청
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
export default ApplyPage;
