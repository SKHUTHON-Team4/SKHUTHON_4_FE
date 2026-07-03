import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Pencil, X } from 'lucide-react';
import {
  getProfile,
  logout,
  updateNickname,
  updateProfileImage,
} from '../api';
import useAuthStore from '../store/authStore';
import BottomNav from '../components/common/BottomNav';

const PROFILE_IMAGES = Array.from({ length: 9 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return `bear_${num}`;
});

export default function Profile() {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [savingNickname, setSavingNickname] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleEditNickname = () => {
    setNicknameInput(profile.nickname || '');
    setNicknameError('');
    setIsEditingNickname(true);
  };

  const handleCancelNickname = () => {
    setNicknameInput('');
    setNicknameError('');
    setIsEditingNickname(false);
  };

  const handleSaveNickname = async () => {
    const nextNickname = nicknameInput.trim();

    if (!nextNickname) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    if (nextNickname.length > 10) {
      setNicknameError('닉네임은 10자 이하로 입력해주세요.');
      return;
    }

    if (nextNickname === profile.nickname) {
      handleCancelNickname();
      return;
    }

    try {
      setSavingNickname(true);
      await updateNickname(nextNickname);

      setProfile((prev) => ({
        ...prev,
        nickname: nextNickname,
      }));

      setIsEditingNickname(false);
      setNicknameError('');
    } catch {
      setNicknameError('닉네임 변경 중 오류가 발생했습니다.');
    } finally {
      setSavingNickname(false);
    }
  };

  const handleSelectImage = async (imageKey) => {
    try {
      await updateProfileImage(imageKey);
      setProfile((prev) => ({ ...prev, profileImage: imageKey }));
      setShowImagePicker(false);
    } catch {
      alert('프로필 이미지 변경 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    logoutStore();
    navigate('/');
  };

  const currentImage = profile?.profileImage || 'bear_01';

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-400">
        불러오는 중...
      </div>
    );
  }

  const stats = [
    { label: '작성한 일기', value: profile.diaryCount },
    { label: '받은 공감', value: profile.receivedEmpathy },
    { label: '준 공감', value: profile.givenEmpathy },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gray-50 pb-28 page-enter">
      <main className="mx-auto w-full max-w-[1180px] overflow-hidden px-5 pt-10 sm:px-6">
        <h1 className="mb-5 text-xl font-bold text-gray-800">
          프로필
        </h1>

        {/* 프로필 카드 */}
        <section className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="relative shrink-0"
              aria-label="프로필 이미지 변경"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 ring-1 ring-primary/20">
                <img
                  src={`/assets/bear_profile/${currentImage}.png`}
                  alt="프로필"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-2 ring-white">
                <Pencil size={10} className="text-white" />
              </div>
            </button>

            <div className="min-w-0 flex-1">
              {isEditingNickname ? (
                <div className="max-w-[420px]">
                  <div className="flex items-center gap-2">
                    <input
                      value={nicknameInput}
                      onChange={(e) => {
                        setNicknameInput(e.target.value);
                        setNicknameError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveNickname();
                        if (e.key === 'Escape') handleCancelNickname();
                      }}
                      maxLength={10}
                      autoFocus
                      className="h-9 min-w-0 flex-1 rounded-lg border border-gray-200 px-3 text-sm font-bold outline-none transition focus:border-primary"
                      placeholder="닉네임"
                    />

                    <button
                      type="button"
                      onClick={handleSaveNickname}
                      disabled={savingNickname}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition active:scale-95 disabled:opacity-50"
                      aria-label="닉네임 저장"
                    >
                      <Check size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelNickname}
                      disabled={savingNickname}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition active:scale-95 disabled:opacity-50"
                      aria-label="닉네임 수정 취소"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    {nicknameError ? (
                      <p className="text-xs text-red-400">{nicknameError}</p>
                    ) : (
                      <p className="text-xs text-gray-400">10자 이하로 입력해주세요</p>
                    )}

                    <span className="shrink-0 text-xs text-gray-400">
                      {nicknameInput.length}/10
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="truncate text-base font-bold text-gray-950">
                    {profile.nickname}
                  </p>

                  <button
                    type="button"
                    onClick={handleEditNickname}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition active:bg-gray-100"
                    aria-label="닉네임 수정"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              )}

              <p className="mt-0.5 truncate text-xs text-gray-400">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 border-t border-gray-100 pt-4">
            {stats.map(({ label, value }, index) => (
              <div
                key={label}
                className={`text-center ${
                  index !== 0 ? 'border-l border-gray-100' : ''
                }`}
              >
                <p className="text-lg font-bold text-primary">{value}</p>
                <p className="mt-0.5 text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 설정 카드 */}
        <section className="mt-4 overflow-hidden rounded-2xl bg-white px-5 shadow-sm ring-1 ring-gray-100">
          <button
            type="button"
            onClick={() => navigate('/bookmarks')}
            className="flex w-full items-center justify-between border-b border-gray-100 py-4 text-left transition active:bg-gray-50"
          >
            <div>
              <p className="text-sm font-bold text-gray-950">북마크한 일기</p>
              <p className="mt-0.5 text-xs text-gray-400">
                저장한 일기를 모아봐요
              </p>
            </div>

            <span className="text-lg text-gray-300">›</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/notification-settings')}
            className="flex w-full items-center justify-between border-b border-gray-100 py-4 text-left transition active:bg-gray-50"
          >
            <div>
              <p className="text-sm font-bold text-gray-950">알림 설정</p>
              <p className="mt-0.5 text-xs text-gray-400">
                밤/아침 알림을 이메일·푸시로 각각 관리해요
              </p>
            </div>

            <span className="text-lg text-gray-300">›</span>
          </button>

          <div className="border-b border-gray-100 py-4">
            <p className="text-xs text-gray-400">이메일 주소</p>
            <p className="mt-1 text-sm text-gray-950">{profile.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-4 text-left text-sm text-red-400 transition active:bg-red-50"
          >
            로그아웃
          </button>
        </section>
      </main>

      <button
        type="button"
        onClick={() => navigate('/write')}
        className="fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg transition active:scale-95"
        aria-label="글쓰기"
      >
        +
      </button>

      {/* 프로필 이미지 선택 모달 */}
      {showImagePicker && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-black/40"
          onClick={() => setShowImagePicker(false)}
        >
          <div
            className="mx-auto flex max-h-[80vh] w-full max-w-[1180px] flex-col rounded-t-3xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-gray-200" />

            <div className="mb-5 flex shrink-0 items-center justify-between">
              <h3 className="text-lg font-bold">프로필 이미지 선택</h3>
              <button onClick={() => setShowImagePicker(false)}>
                <X size={22} className="text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3 overflow-y-auto pb-8">
              {PROFILE_IMAGES.map((key) => {
                const isSelected = currentImage === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectImage(key)}
                    className="relative flex items-center justify-center"
                  >
                    <div
                      className={`flex aspect-square w-full items-center justify-center rounded-full transition ${
                        isSelected
                          ? 'ring-2 ring-primary bg-primary/10'
                          : 'ring-1 ring-primary/20 bg-gray-50'
                      }`}
                    >
                      <img
                        src={`/assets/bear_profile/${key}.png`}
                        alt={key}
                        className="w-3/5 aspect-square object-contain"
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-2 ring-white">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
