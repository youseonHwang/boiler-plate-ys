import axios from 'axios';
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER
} from './types';

/* 로그인 요청 */
export function loginUser(dataToSubmit) {

  const request = axios.post('api/users/login', dataToSubmit)
    .then(response => response.data) //request에 저장
  return { // reducer로 보내야 함. 왜냐하면 reducer에서 previosState와 action을 조합해서 다음 state를 만들어주기 때문에
    type: LOGIN_USER,
    payload: request
  }
}

/* 회원가입 요청 */
export function registerUser(dataToSubmit) {

  const request = axios.post('api/users/register', dataToSubmit)
    .then(response => response.data) //request에 저장
  return { // reducer로 보내야 함. 왜냐하면 reducer에서 previosState와 action을 조합해서 다음 state를 만들어주기 때문에
    type: REGISTER_USER,
    payload: request
  }

}

/* 회원가입 요청 */
export function auth() {
  const request = axios.get('api/users/auth')
    .then(response => response.data) //request에 저장
  return { // reducer로 보내야 함. 왜냐하면 reducer에서 previosState와 action을 조합해서 다음 state를 만들어주기 때문에
    type: AUTH_USER,
    payload: request
  }
}