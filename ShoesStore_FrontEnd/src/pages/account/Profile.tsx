import { accountApi } from "@/api/account.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { User } from "@/types/auth.types";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
  const setAuthUser = useAuthStore((s) => s.setUser);
  const [user, setUser] = useState<User | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatarUrl,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { getProfile, upLoadAvatar } = accountApi;

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getProfile();
      setUser(data);
      setAuthUser(data);
    };
    fetchUser();
  }, [avatarPreview, getProfile, setAuthUser]);

  const handleChooseAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate nhẹ
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    setAvatarFile(file);

    try {
      const avatarUrl = await upLoadAvatar(file);

      setAvatarPreview(avatarUrl);
    } catch (error) {
      console.error("Failed to upload avatar", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);

      // const res = await axios.post("/api/users/avatar", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // update user global / context
      // setUser((prev: any) => ({
      //   ...prev,
      //   avatarUrl: avatarPreview,
      // }));
    }

    alert("Profile updated");
  };

  return (
    <div className="md:col-span-3 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">
          Personal Information
        </h1>
        <p className="text-[#9a5f4c] dark:text-[#b08e84]">
          Manage your personal details and how we contact you.
        </p>
      </div>
      <div className="bg-white dark:bg-[#2c1d18] rounded-xl border border-[#e7d5cf] dark:border-[#3d2a23] shadow-sm overflow-hidden">
        <form className="p-8 space-y-8">
          <div className="flex items-center gap-8 pb-8 border-b border-[#e7d5cf] dark:border-[#3d2a23]">
            <div className="relative group">
              <div className="size-24 rounded-full overflow-hidden border-4 border-white dark:border-[#3d2a23] shadow-lg">
                <img
                  alt="Large profile avatar"
                  className="w-full h-full object-cover"
                  src={
                    user?.avatarUrl ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAJJxi1c0TcmIzQtI9_iCAlFrUWKjfJDfG7pEhbtFpyQryl91Ht3ahxtM2yFPtwELsVgR9VWDvdc4t7aGJqa03CegzR0Ei7cqEH6ZISzlo5JkiRouIgmGF1GAcxq4MwRnyE4ZnwL6neg3pCzwf--SJHdvWHVoLdIhroDHxrRbw9mhPFTQg1MyXTHsVsN0x02U7QgnMkojEkIB9zm9OMFe2RfkdhAoUeq6PU0csq-TyJ2YVjbAxWovSsHa-vmUcWnndez_N58U-ULYs"
                  }
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">Profile Picture</h3>
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={handleChooseAvatar}
                  className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Upload New
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(undefined);
                    setAvatarFile(null);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#fcf9f8] dark:bg-background-dark border border-[#e7d5cf] dark:border-[#3d2a23] rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Full Name</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                type="text"
                value={user?.userName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Email Address</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                type="email"
                value={user?.email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-[#e7d5cf] dark:border-[#3d2a23] bg-[#e7d5cf]/20 dark:bg-background-dark text-[#9a5f4c] text-sm font-medium">
                  +1
                </span>
                <input
                  className="form-input w-full rounded-r-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                  type="tel"
                  value={user?.phoneNumber}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Date of Birth</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                type="date"
                defaultValue="1992-08-15"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e7d5cf] dark:border-[#3d2a23]">
            <button
              className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
              type="submit"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex gap-4">
        <span className="material-symbols-outlined text-primary text-2xl">
          shield
        </span>
        <div>
          <h4 className="font-bold text-sm mb-1">Your data is safe</h4>
          <p className="text-sm text-[#9a5f4c] dark:text-[#b08e84]">
            We use industry-standard encryption to protect your personal
            details. Only you can view or modify this information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
