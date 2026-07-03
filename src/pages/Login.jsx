import { redirectToKakaoLogin } from '../api';

export default function Login() {
  const handleKakaoLogin = () => {
    redirectToKakaoLogin();
  };

  return (
    <div className="relative h-screen flex flex-col justify-between overflow-hidden bg-[#FAF8FF] px-8 py-14">
      {/* 상단 */}
      <div className="relative z-10 flex flex-col items-center pt-20 text-center sm:pt-10">
        <p className="text-sm font-extrabold text-primary">
          청춘을 잇는 감정 기록
        </p>

        <h1 className="mt-4 text-[56px] font-black leading-none text-[#302658] drop-shadow-[0_6px_18px_rgba(124,92,252,0.18)]">
          청춘잇다
        </h1>

        <div className="mt-8 flex items-center justify-center">
          <img
            src="/assets/bear-face.png"
            alt="청춘잇다 캐릭터 얼굴"
            className="h-52 w-52 object-contain drop-shadow-[0_14px_24px_rgba(124,92,252,0.2)]"
          />
        </div>
      </div>

      {/* 하단 */}
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={handleKakaoLogin}
          className="w-full max-w-[360px] flex items-center rounded-2xl bg-[#FEE500] shadow-sm transition hover:brightness-95 overflow-hidden"
        >
          <div className="flex items-center justify-center w-14 h-14">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M11 2C5.477 2 1 5.686 1 10.2c0 2.912 1.82 5.47 4.584 6.97l-.9 3.35a.4.4 0 00.59.444l3.94-2.61c.588.08 1.19.12 1.786.12 5.523 0 10-3.686 10-8.2S16.523 2 11 2z"
                fill="#191919"
              />
            </svg>
          </div>
          <span className="flex-1 text-center text-[17px] font-bold text-[#191919] pr-14">
            카카오 로그인
          </span>
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          로그인 시 이용약관 및 개인정보처리방침에
          <br />
          동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
