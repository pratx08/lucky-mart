import { takeLatest, put, delay, call } from 'redux-saga/effects';
import { loginRequest, loginSuccess, logout } from '../reducers/authReducer';

// ✅ Fake API login function
function fakeLoginApi({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === '4113') {
        resolve({ token: 'mock-token-123', user: { username } });
      } else if (username === 'lucky' && password === '4113') {
        resolve({ token: 'mock-token-123', user: { username } }); // ✅ Fixed: user must be object
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
}

// ✅ Handle login logic
function* handleLogin(action) {
  try {
    const data = yield call(fakeLoginApi, action.payload);
    const { username } = data.user;
    const role = username === 'admin' ? 'admin' : 'user';

    // Save to localStorage for session persistence
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ username, role }));

    // Dispatch login success
    yield put(loginSuccess({
      user: { username, role },
      token: data.token,
    }));

    // Set 1-hour session timeout
    yield delay(3600000);
    yield put(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');

  } catch (err) {
    alert(err.message || 'Login failed');
  }
}

function* handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
}
