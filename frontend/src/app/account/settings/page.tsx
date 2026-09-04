"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquareWarning,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import Container from "@/components/layout/Container";

type SettingsTab =
  | "profile"
  | "security"
  | "notifications"
  | "account";

interface ProfileForm {
  displayName: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileErrors {
  displayName?: string;
  email?: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface NotificationSettings {
  reviewResult: boolean;
  favoriteUpdates: boolean;
  securityAlerts: boolean;
}

interface LoginDevice {
  id: string;
  name: string;
  description: string;
  current: boolean;
  lastActive: string;
}

const mockProfile: ProfileForm = {
  displayName: "Sakura 用户",
  email: "user@example.com",
};

const mockDevices: LoginDevice[] = [
  {
    id: "device-current",
    name: "Windows · Chrome",
    description: "当前登录设备",
    current: true,
    lastActive: "刚刚",
  },
  {
    id: "device-mobile",
    name: "iPhone · Safari",
    description: "移动设备",
    current: false,
    lastActive: "2026-08-30",
  },
];

const tabs: {
  value: SettingsTab;
  label: string;
}[] = [
  {
    value: "profile",
    label: "基本资料",
  },
  {
    value: "security",
    label: "账号与安全",
  },
  {
    value: "notifications",
    label: "通知设置",
  },
  {
    value: "account",
    label: "账号管理",
  },
];

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("profile");

  const [profile, setProfile] =
    useState<ProfileForm>(mockProfile);

  const [savedProfile, setSavedProfile] =
    useState<ProfileForm>(mockProfile);

  const [profileMessage, setProfileMessage] =
    useState("");

  const [profileErrors, setProfileErrors] =
    useState<ProfileErrors>({});

  const [password, setPassword] =
    useState<PasswordForm>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordErrors, setPasswordErrors] =
    useState<PasswordErrors>({});

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [notifications, setNotifications] =
    useState<NotificationSettings>({
      reviewResult: true,
      favoriteUpdates: true,
      securityAlerts: true,
    });

  const [devices, setDevices] =
    useState<LoginDevice[]>(mockDevices);

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [deleteConfirmText, setDeleteConfirmText] =
    useState("");

  const profileChanged = useMemo(() => {
    return (
      profile.displayName !== savedProfile.displayName ||
      profile.email !== savedProfile.email
    );
  }, [profile, savedProfile]);

  function updateProfile(
    field: keyof ProfileForm,
    value: string
    ) {
    setProfile((current) => ({
        ...current,
        [field]: value,
    }));

    setProfileErrors((current) => ({
        ...current,
        [field]: undefined,
    }));

    setProfileMessage("");
    }

    function handleDisplayNameChange(
        event: ChangeEvent<HTMLInputElement>
        ) {
        const value = event.target.value
            .replace(/[\r\n\t]/g, "")
            .slice(0, 50);

        updateProfile("displayName", value);
        }

        function handleEmailChange(
        event: ChangeEvent<HTMLInputElement>
        ) {
        const value = event.target.value
            .replace(/\s/g, "")
            .slice(0, 254);

        updateProfile("email", value);
    }

  function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>
    ) {
    event.preventDefault();

    const displayName =
        profile.displayName.trim();

    const email =
        profile.email.trim().toLowerCase();

    const errors: ProfileErrors = {};

    if (!displayName) {
        errors.displayName = "请输入昵称。";
    } else if (displayName.length < 2) {
        errors.displayName =
        "昵称至少需要 2 个字符。";
    } else if (displayName.length > 50) {
        errors.displayName =
        "昵称最多输入 50 个字符。";
    } else if (
        /[\u0000-\u001F\u007F]/.test(
        displayName
        )
    ) {
        errors.displayName =
        "昵称包含不支持的字符。";
    }

    if (!email) {
        errors.email = "请输入邮箱地址。";
    } else if (email.length > 254) {
        errors.email =
        "邮箱地址最多输入 254 个字符。";
    } else if (!isValidEmail(email)) {
        errors.email =
        "请输入正确的邮箱地址。";
    }

    if (Object.keys(errors).length > 0) {
        setProfileErrors(errors);
        setProfileMessage("");
        return;
    }

    const nextProfile = {
        displayName,
        email,
    };

    /*
    * TODO [API - PATCH]
    * PATCH /api/me
    *
    * Body:
    * {
    *   displayName: string;
    *   email: string;
    * }
    *
    * 后端必须重新执行相同的数据校验。
    *
    * 邮箱发生变化时：
    * - 不直接替换已验证邮箱
    * - 向新邮箱发送验证码 / 验证链接
    * - 验证成功后才正式修改
    * - Rate Limit
    * - 写入安全审计日志
    */

    setProfile(nextProfile);
    setSavedProfile(nextProfile);
    setProfileErrors({});
    setProfileMessage("基本资料已保存。");
    }

  function handlePasswordSubmit(
    event: FormEvent<HTMLFormElement>
    ) {
    event.preventDefault();

    const currentPassword =
        password.currentPassword;

    const newPassword =
        password.newPassword;

    const confirmPassword =
        password.confirmPassword;

    const errors: PasswordErrors = {};

    if (!currentPassword) {
        errors.currentPassword =
        "请输入当前密码。";
    } else if (currentPassword.length > 128) {
        errors.currentPassword =
        "当前密码格式不正确。";
    }

    if (!newPassword) {
        errors.newPassword =
        "请输入新密码。";
    } else if (newPassword.length < 8) {
        errors.newPassword =
        "新密码至少需要 8 个字符。";
    } else if (newPassword.length > 128) {
        errors.newPassword =
        "新密码最多输入 128 个字符。";
    } else if (
        !/[A-Za-z]/.test(newPassword) ||
        !/\d/.test(newPassword)
    ) {
        errors.newPassword =
        "新密码至少需要包含字母和数字。";
    } else if (
        isCommonWeakPassword(newPassword)
    ) {
        errors.newPassword =
        "这个密码过于简单，请更换一个密码。";
    } else if (
        currentPassword === newPassword
    ) {
        errors.newPassword =
        "新密码不能与当前密码相同。";
    }

    if (!confirmPassword) {
        errors.confirmPassword =
        "请再次输入新密码。";
    } else if (
        newPassword !== confirmPassword
    ) {
        errors.confirmPassword =
        "两次输入的新密码不一致。";
    }

    if (Object.keys(errors).length > 0) {
        setPasswordErrors(errors);
        setPasswordMessage("");
        return;
    }

    /*
    * TODO [API - POST]
    * POST /api/me/password
    *
    * Body:
    * {
    *   currentPassword: string;
    *   newPassword: string;
    * }
    *
    * 后端：
    * - 必须重新验证当前密码
    * - Argon2id Hash
    * - Rate Limit
    * - CSRF 防护
    * - 密码历史策略（如后续需要）
    * - 修改成功撤销其他 Session
    * - 写入安全审计日志
    * - 发送安全通知
    *
    * 不记录明文密码。
    */

    setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    setPasswordErrors({});
    setPasswordMessage(
        "密码修改成功，其他设备将需要重新登录。"
    );
}

  function updateNotification(
    key: keyof NotificationSettings
  ) {
    setNotifications((current) => {
      const next = {
        ...current,
        [key]: !current[key],
      };

      /*
       * TODO [API - PATCH]
       * PATCH /api/me/notification-settings
       *
       * Body:
       * {
       *   reviewResult: boolean;
       *   favoriteUpdates: boolean;
       *   securityAlerts: boolean;
       * }
       */

      return next;
    });
  }

  function logoutDevice(deviceId: string) {
    /*
     * TODO [API - DELETE]
     * DELETE /api/me/sessions/:sessionId
     *
     * 后端必须确认该 Session 属于当前用户。
     */

    setDevices((current) =>
      current.filter(
        (device) =>
          device.id !== deviceId ||
          device.current
      )
    );
  }

  function logoutAllOtherDevices() {
    /*
     * TODO [API - DELETE]
     * DELETE /api/me/sessions
     *
     * Purpose:
     * Revoke every session except current session.
     */

    setDevices((current) =>
      current.filter((device) => device.current)
    );

    setShowLogoutConfirm(false);
  }

  function deleteAccount() {
    if (deleteConfirmText !== "永久注销") {
      return;
    }

    /*
     * TODO [API - DELETE]
     * DELETE /api/me
     *
     * 后端需要：
     * - 要求重新认证
     * - CSRF 防护
     * - Rate Limit
     * - 记录安全审计
     * - 根据隐私政策处理用户数据
     * - 处理用户发布内容、收藏、附件等关联数据
     * - 注销成功后销毁所有 Session
     */

    setShowDeleteConfirm(false);
    setDeleteConfirmText("");

    alert(
      "当前为前端 Mock，尚未真正注销账号。"
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP */}

      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="px-4 py-5">
            <Link
              href="/account"
              className="
                inline-flex
                min-h-10
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              <ArrowLeft size={16} />
              返回个人中心
            </Link>
          </div>
        </Container>
      </section>

      {/* CONTENT */}

      <section className="py-8 sm:py-10">
        <Container>
          <div className="px-4">
            {/* HEADER */}

            <div>
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-blue-600
                "
              >
                ACCOUNT SETTINGS
              </p>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-black
                  tracking-tight
                  text-slate-950
                "
              >
                账号设置
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                管理你的个人资料、账号安全和通知偏好。
              </p>
            </div>

            <div
              className="
                mt-8
                grid
                gap-6
                lg:grid-cols-[220px_minmax(0,1fr)]
              "
            >
              {/* NAV */}

              <aside className="min-w-0">
                <div
                  className="
                    -mx-1
                    flex
                    gap-2
                    overflow-x-auto
                    px-1
                    pb-2
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                    lg:mx-0
                    lg:block
                    lg:overflow-visible
                    lg:rounded-[22px]
                    lg:border
                    lg:border-slate-200
                    lg:bg-white
                    lg:p-2
                    lg:shadow-sm
                  "
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() =>
                        setActiveTab(tab.value)
                      }
                      className={`
                        min-h-11
                        shrink-0
                        rounded-xl
                        px-4
                        py-3
                        text-left
                        text-sm
                        font-black
                        transition
                        lg:mb-1
                        lg:w-full
                        lg:last:mb-0
                        ${
                          activeTab === tab.value
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 lg:border-transparent"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </aside>

              {/* MAIN */}

              <div className="min-w-0">
                {activeTab === "profile" && (
                  <ProfileSection
                    profile={profile}
                    profileChanged={profileChanged}
                    errors={profileErrors}
                    message={profileMessage}
                    onDisplayNameChange={
                      handleDisplayNameChange
                    }
                    onEmailChange={
                      handleEmailChange
                    }
                    onSubmit={
                      handleProfileSubmit
                    }
                  />
                )}

                {activeTab === "security" && (
                  <SecuritySection
                    password={password}
                    passwordErrors={passwordErrors}
                    passwordMessage={
                      passwordMessage
                    }
                    showCurrentPassword={
                      showCurrentPassword
                    }
                    showNewPassword={
                      showNewPassword
                    }
                    showConfirmPassword={
                      showConfirmPassword
                    }
                    devices={devices}
                    onPasswordChange={(field, value) => {
                        setPassword((current) => ({
                            ...current,
                            [field]: value.slice(0, 128),
                        }));

                        setPasswordErrors((current) => ({
                            ...current,
                            [field]: undefined,
                        }));

                        setPasswordMessage("");
                        }}
                    onToggleCurrent={() =>
                      setShowCurrentPassword(
                        (current) =>
                          !current
                      )
                    }
                    onToggleNew={() =>
                      setShowNewPassword(
                        (current) =>
                          !current
                      )
                    }
                    onToggleConfirm={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    onPasswordSubmit={
                      handlePasswordSubmit
                    }
                    onLogoutDevice={
                      logoutDevice
                    }
                    onLogoutOthers={() =>
                      setShowLogoutConfirm(
                        true
                      )
                    }
                  />
                )}

                {activeTab ===
                  "notifications" && (
                  <NotificationsSection
                    settings={
                      notifications
                    }
                    onToggle={
                      updateNotification
                    }
                  />
                )}

                {activeTab === "account" && (
                  <AccountManagementSection
                    onDelete={() =>
                      setShowDeleteConfirm(
                        true
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* LOGOUT OTHER DEVICES */}

      {showLogoutConfirm && (
        <ModalShell
          onClose={() =>
            setShowLogoutConfirm(false)
          }
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-amber-50
              text-amber-600
            "
          >
            <LogOut size={20} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-slate-950
            "
          >
            退出其他设备？
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            除当前设备外，其他已经登录 Sakura
            的设备都需要重新登录。
          </p>

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={() =>
                setShowLogoutConfirm(false)
              }
              className={secondaryButtonClass}
            >
              取消
            </button>

            <button
              type="button"
              onClick={logoutAllOtherDevices}
              className={darkButtonClass}
            >
              确定退出
            </button>
          </div>
        </ModalShell>
      )}

      {/* DELETE ACCOUNT */}

      {showDeleteConfirm && (
        <ModalShell
          onClose={() => {
            setShowDeleteConfirm(false);
            setDeleteConfirmText("");
          }}
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-rose-50
              text-rose-600
            "
          >
            <Trash2 size={20} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-slate-950
            "
          >
            永久注销账号
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            这是高风险操作。账号注销后可能无法恢复，
            相关账号数据将按照平台的数据处理规则进行处理。
          </p>

          <div
            className="
              mt-5
              rounded-xl
              border
              border-rose-100
              bg-rose-50
              p-4
              text-xs
              leading-5
              text-rose-700
            "
          >
            请输入
            <strong className="mx-1">
              永久注销
            </strong>
            以确认操作。
          </div>

          <input
            type="text"
            value={deleteConfirmText}
            maxLength={4}
            onChange={(event) =>
              setDeleteConfirmText(
                event.target.value.slice(
                  0,
                  4
                )
              )
            }
            placeholder="永久注销"
            className={`
              ${inputClass}
              mt-4
            `}
          />

          <div
            className="
              mt-6
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText("");
              }}
              className={secondaryButtonClass}
            >
              取消
            </button>

            <button
              type="button"
              disabled={
                deleteConfirmText !==
                "永久注销"
              }
              onClick={deleteAccount}
              className="
                min-h-11
                rounded-xl
                bg-rose-600
                px-5
                py-2.5
                text-sm
                font-black
                text-white
                transition
                hover:bg-rose-700
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              永久注销账号
            </button>
          </div>
        </ModalShell>
      )}
    </main>
  );
}

function ProfileSection({
    profile,
    errors,
    profileChanged,
    message,
    onDisplayNameChange,
    onEmailChange,
    onSubmit,
    }: {
    profile: ProfileForm;
    errors: ProfileErrors;
    profileChanged: boolean;
    message: string;
    onDisplayNameChange: (
        event: ChangeEvent<HTMLInputElement>
    ) => void;
    onEmailChange: (
        event: ChangeEvent<HTMLInputElement>
    ) => void;
    onSubmit: (
        event: FormEvent<HTMLFormElement>
    ) => void;
    }) {
  return (
    <div className="space-y-5">
      <SettingsCard
        title="基本资料"
        description="这些信息用于你的 Sakura 账号。"
        icon="profile"
      >
        <form
          onSubmit={onSubmit}
          className="mt-6"
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
            "
          >
            <div
              className="
                flex
                h-20
                w-20
                shrink-0
                items-center
                justify-center
                rounded-[22px]
                bg-slate-950
                text-white
                shadow-lg
              "
            >
              <User size={30} />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-black
                  text-slate-900
                "
              >
                头像
              </p>

              <p
                className="
                  mt-1
                  max-w-lg
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                头像上传将在用户文件系统接入后开放。
                当前使用默认头像。
              </p>

              {/*
                TODO [API - POST]
                POST /api/me/avatar

                使用私有上传流程。
                后端验证文件类型、文件大小并重新编码图片。
              */}
            </div>
          </div>

          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >
            <Field
              label="昵称"
              hint={`${profile.displayName.length}/50`}
            >
              <input
                type="text"
                value={profile.displayName}
                minLength={2}
                maxLength={50}
                onChange={onDisplayNameChange}
                autoComplete="nickname"
                placeholder="请输入昵称"
                aria-invalid={Boolean(
                    errors.displayName
                )}
                className={inputClass}
                />

                {errors.displayName && (
                <p className="mt-2 text-xs font-bold text-rose-600">
                    {errors.displayName}
                </p>
                )}
            </Field>

            <Field
              label="邮箱"
              hint={`${profile.email.length}/254`}
            >
              <input
                type="email"
                value={profile.email}
                maxLength={254}
                onChange={onEmailChange}
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                autoCapitalize="none"
                aria-invalid={Boolean(errors.email)}
                placeholder="name@example.com"
                className={inputClass}
                />

                {errors.email && (
                <p className="mt-2 text-xs font-bold text-rose-600">
                    {errors.email}
                </p>
                )}
            </Field>
          </div>

          {message && (
            <div
              className="
                mt-5
                rounded-xl
                border
                border-blue-100
                bg-blue-50
                px-4
                py-3
                text-sm
                font-bold
                text-blue-700
              "
            >
              {message}
            </div>
          )}

          <div
            className="
              mt-6
              flex
              justify-end
            "
          >
            <button
              type="submit"
              disabled={!profileChanged}
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-black
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Save size={16} />
              保存资料
            </button>
          </div>
        </form>
      </SettingsCard>
    </div>
  );
}

function SecuritySection({
  password,
  passwordErrors,
  passwordMessage,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  devices,
  onPasswordChange,
  onToggleCurrent,
  onToggleNew,
  onToggleConfirm,
  onPasswordSubmit,
  onLogoutDevice,
  onLogoutOthers,
}: {
  password: PasswordForm;
  passwordErrors: PasswordErrors;
  passwordMessage: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  devices: LoginDevice[];
  onPasswordChange: (
    field: keyof PasswordForm,
    value: string
  ) => void;
  onToggleCurrent: () => void;
  onToggleNew: () => void;
  onToggleConfirm: () => void;
  onPasswordSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
  onLogoutDevice: (
    deviceId: string
  ) => void;
  onLogoutOthers: () => void;
}) {
  return (
    <div className="space-y-5">
      <SettingsCard
        title="修改密码"
        description="定期更新密码可以降低账号被盗风险。"
        icon="password"
      >
        <form
          onSubmit={onPasswordSubmit}
          className="mt-6 space-y-5"
        >
          <PasswordField
            label="当前密码"
            value={
              password.currentPassword
            }
            visible={
              showCurrentPassword
            }
            autoComplete="current-password"
            onToggle={onToggleCurrent}
            onChange={(value) =>
              onPasswordChange(
                "currentPassword",
                value
              )
            }
            error={
                passwordErrors.currentPassword
            }
          />

          <PasswordField
            label="新密码"
            value={password.newPassword}
            visible={showNewPassword}
            autoComplete="new-password"
            hint="8～128 个字符，至少包含字母和数字"
            onToggle={onToggleNew}
            onChange={(value) =>
              onPasswordChange(
                "newPassword",
                value
              )
            }
            error={
                passwordErrors.newPassword
            }
          />

          <PasswordField
            label="再次输入新密码"
            value={
              password.confirmPassword
            }
            visible={
              showConfirmPassword
            }
            autoComplete="new-password"
            onToggle={onToggleConfirm}
            onChange={(value) =>
              onPasswordChange(
                "confirmPassword",
                value
              )
            }
            error={
                passwordErrors.confirmPassword
            }
          />

          {passwordMessage && (
            <div
              className="
                rounded-xl
                border
                border-blue-100
                bg-blue-50
                px-4
                py-3
                text-sm
                font-bold
                text-blue-700
              "
            >
              {passwordMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className={darkButtonClass}
            >
              <KeyRound size={16} />
              修改密码
            </button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard
        title="登录设备"
        description="查看当前账号已经登录的设备。发现陌生设备时请立即退出并修改密码。"
        icon="device"
      >
        <div className="mt-6 space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-slate-200
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    text-slate-600
                  "
                >
                  {device.name
                    .toLowerCase()
                    .includes(
                      "iphone"
                    ) ? (
                    <Smartphone
                      size={18}
                    />
                  ) : (
                    <Laptop size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <p
                      className="
                        truncate
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      {device.name}
                    </p>

                    {device.current && (
                      <span
                        className="
                          rounded-full
                          bg-emerald-50
                          px-2
                          py-0.5
                          text-[10px]
                          font-black
                          text-emerald-700
                        "
                      >
                        当前设备
                      </span>
                    )}
                  </div>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    {device.description}
                    {" · "}
                    {device.lastActive}
                  </p>
                </div>
              </div>

              {!device.current && (
                <button
                  type="button"
                  onClick={() =>
                    onLogoutDevice(
                      device.id
                    )
                  }
                  className="
                    min-h-10
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    text-xs
                    font-black
                    text-slate-600
                    transition
                    hover:border-rose-200
                    hover:bg-rose-50
                    hover:text-rose-600
                  "
                >
                  退出设备
                </button>
              )}
            </div>
          ))}
        </div>

        {devices.some(
          (device) => !device.current
        ) && (
          <button
            type="button"
            onClick={onLogoutOthers}
            className="
              mt-5
              inline-flex
              min-h-11
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              px-4
              text-sm
              font-black
              text-slate-600
              transition
              hover:border-rose-200
              hover:bg-rose-50
              hover:text-rose-600
            "
          >
            <LogOut size={16} />
            退出其他所有设备
          </button>
        )}
      </SettingsCard>

      <div
        className="
          rounded-[22px]
          border
          border-emerald-100
          bg-emerald-50
          p-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <ShieldCheck
            size={19}
            className="
              mt-0.5
              shrink-0
              text-emerald-700
            "
          />

          <div>
            <h3
              className="
                text-sm
                font-black
                text-emerald-950
              "
            >
              账号安全
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-emerald-800/80
              "
            >
              Sakura
              后端接入后将使用安全 Session、
              HttpOnly Cookie、密码哈希、登录限流和安全审计。
              管理员账号还需要额外的二次验证。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection({
  settings,
  onToggle,
}: {
  settings: NotificationSettings;
  onToggle: (
    key: keyof NotificationSettings
  ) => void;
}) {
  return (
    <SettingsCard
      title="通知设置"
      description="选择哪些重要变化需要提醒你。"
      icon="notification"
    >
      <div className="mt-6 divide-y divide-slate-100">
        <NotificationRow
          icon="review"
          title="内容审核结果"
          description="你发布的房源、工作、经验或避坑内容审核完成时通知。"
          checked={
            settings.reviewResult
          }
          onChange={() =>
            onToggle("reviewResult")
          }
        />

        <NotificationRow
          icon="favorite"
          title="收藏内容更新"
          description="你收藏的工作、房源或学校出现重要更新时通知。"
          checked={
            settings.favoriteUpdates
          }
          onChange={() =>
            onToggle(
              "favoriteUpdates"
            )
          }
        />

        <NotificationRow
          icon="security"
          title="安全提醒"
          description="出现新设备登录、密码修改等账号安全事件时通知。"
          checked={
            settings.securityAlerts
          }
          onChange={() =>
            onToggle(
              "securityAlerts"
            )
          }
        />
      </div>

      <div
        className="
          mt-5
          rounded-xl
          border
          border-blue-100
          bg-blue-50
          p-4
          text-xs
          leading-5
          text-blue-700
        "
      >
        安全类通知未来可能包含必须发送的系统通知，
        此类通知不会因为普通通知偏好而被完全关闭。
      </div>
    </SettingsCard>
  );
}

function AccountManagementSection({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <div className="space-y-5">
      <SettingsCard
        title="账号管理"
        description="管理与账号生命周期相关的操作。"
        icon="account"
      >
        <div
          className="
            mt-6
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-slate-200
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h3
              className="
                text-sm
                font-black
                text-slate-900
              "
            >
              退出当前账号
            </h3>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
              "
            >
              退出后需要重新登录才能访问个人中心。
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              /*
               * TODO [API - POST]
               * POST /api/auth/logout
               *
               * 后端销毁当前 Session，
               * 清除认证 Cookie。
               */
              alert(
                "当前为前端 Mock，尚未接入真实退出登录。"
              );
            }}
            className={secondaryButtonClass}
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </SettingsCard>

      <div
        className="
          rounded-[24px]
          border
          border-rose-200
          bg-white
          p-5
          shadow-sm
          sm:p-6
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-rose-50
              text-rose-600
            "
          >
            <CircleAlert size={18} />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-base
                font-black
                text-slate-950
              "
            >
              危险区域
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
              "
            >
              以下操作会影响整个 Sakura
              账号，请确认后再继续。
            </p>
          </div>
        </div>

        <div
          className="
            mt-5
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-rose-100
            bg-rose-50/50
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h3
              className="
                text-sm
                font-black
                text-rose-950
              "
            >
              永久注销账号
            </h3>

            <p
              className="
                mt-1
                max-w-xl
                text-xs
                leading-5
                text-rose-800/70
              "
            >
              注销后账号可能无法恢复。
              正式接入后会要求重新验证身份，
              并明确说明相关数据的处理方式。
            </p>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="
              inline-flex
              min-h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-rose-600
              px-4
              text-sm
              font-black
              text-white
              transition
              hover:bg-rose-700
            "
          >
            <Trash2 size={16} />
            注销账号
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon:
    | "profile"
    | "password"
    | "device"
    | "notification"
    | "account";
  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-6
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-600
          "
        >
          {icon === "profile" && (
            <User size={18} />
          )}

          {icon === "password" && (
            <LockKeyhole size={18} />
          )}

          {icon === "device" && (
            <Laptop size={18} />
          )}

          {icon ===
            "notification" && (
            <Bell size={18} />
          )}

          {icon === "account" && (
            <ShieldCheck size={18} />
          )}
        </div>

        <div>
          <h2
            className="
              text-base
              font-black
              text-slate-950
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <span
          className="
            text-sm
            font-black
            text-slate-800
          "
        >
          {label}
        </span>

        {hint && (
          <span
            className="
              text-[11px]
              font-bold
              text-slate-400
            "
          >
            {hint}
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

function PasswordField({
  label,
  value,
  visible,
  autoComplete,
  hint,
  error,
  onChange,
  onToggle,
}: {
  label: string;
  value: string;
  visible: boolean;
  autoComplete: string;
  hint?: string;
  error?: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          minLength={
            autoComplete === "new-password"
              ? 8
              : undefined
          }
          maxLength={128}
          autoComplete={autoComplete}
          spellCheck={false}
          autoCapitalize="none"
          aria-invalid={Boolean(error)}
          onChange={(event) =>
            onChange(
              event.target.value.slice(
                0,
                128
              )
            )
          }
          className={`${inputClass} pr-12`}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "隐藏密码"
              : "显示密码"
          }
          className="
            absolute
            right-1.5
            top-1/2
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs font-bold text-rose-600">
          {error}
        </p>
      )}
    </Field>
  );
}

function NotificationRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon:
    | "review"
    | "favorite"
    | "security";
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-4
        py-5
        first:pt-0
        last:pb-0
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          text-slate-600
        "
      >
        {icon === "review" && (
          <MessageSquareWarning
            size={18}
          />
        )}

        {icon === "favorite" && (
          <Heart size={18} />
        )}

        {icon === "security" && (
          <ShieldCheck size={18} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="
            text-sm
            font-black
            text-slate-900
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            max-w-2xl
            text-xs
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`
          relative
          mt-1
          h-7
          w-12
          shrink-0
          rounded-full
          transition
          ${
            checked
              ? "bg-blue-600"
              : "bg-slate-200"
          }
        `}
      >
        <span
          className={`
            absolute
            top-1
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
            transition
            ${
              checked
                ? "left-6"
                : "left-1"
            }
          `}
        >
          {checked && (
            <Check
              size={11}
              className="text-blue-600"
            />
          )}
        </span>
      </button>
    </div>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-slate-950/60
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          rounded-t-[26px]
          bg-white
          p-6
          shadow-2xl
          sm:rounded-[26px]
        "
      >
        {children}
      </div>
    </div>
  );
}

function isValidEmail(
  value: string
) {
  if (
    value.length > 254 ||
    value.startsWith(".") ||
    value.endsWith(".") ||
    value.includes("..")
  ) {
    return false;
  }

  return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(
    value
  );
}

function isCommonWeakPassword(
  value: string
) {
  const normalized =
    value.toLowerCase();

  const weakPasswords = new Set([
    "password1",
    "password123",
    "12345678a",
    "123456789a",
    "qwerty123",
    "abc12345",
    "admin123",
    "sakura123",
  ]);

  return weakPasswords.has(normalized);
}

const inputClass = `
  min-h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-2.5
  text-sm
  font-semibold
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-400
  focus:ring-4
  focus:ring-blue-50
`;

const secondaryButtonClass = `
  inline-flex
  min-h-11
  items-center
  justify-center
  gap-2
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-2.5
  text-sm
  font-black
  text-slate-600
  transition
  hover:border-slate-300
  hover:bg-slate-50
  hover:text-slate-950
`;

const darkButtonClass = `
  inline-flex
  min-h-11
  items-center
  justify-center
  gap-2
  rounded-xl
  bg-slate-950
  px-5
  py-2.5
  text-sm
  font-black
  text-white
  transition
  hover:bg-slate-800
`;