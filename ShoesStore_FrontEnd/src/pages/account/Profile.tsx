import { accountApi } from "@/api/account.api";
import { useAuthStore } from "@/stores/auth/auth.store";
import type { UpdateProfilePayload } from "@/types/account.types";
import type { User } from "@/types/auth.types";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const [user, setUser] = useState<User | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user?.avatarUrl,
  );
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

    try {
      const avatarUrl = await upLoadAvatar(file);

      setAvatarPreview(avatarUrl);
    } catch (error) {
      console.error("Failed to upload avatar", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const payload: UpdateProfilePayload = {
      userName: user.userName,
      phone: user.phone,
      birthDate: user.birthDate,
    };

    try {
      setLoading(true);
      const updatedUser = await accountApi.updateProfile(payload);
      // cập nhật state trang
      setUser(updatedUser);

      // cập nhật zustand + localStorage
      setAuthUser(updatedUser);

      // toast.success("Profile updated successfully 🎉");
    } catch (error: any) {
      console.error(error);
      // toast.error(error?.response?.data?.message || "Update profile failed");
    } finally {
      setLoading(false);
    }
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
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-8 pb-8 border-b border-[#e7d5cf] dark:border-[#3d2a23]">
            <div className="relative group">
              <div className="size-24 rounded-full overflow-hidden border-4 border-white dark:border-[#3d2a23] shadow-lg">
                <img
                  alt="Large profile avatar"
                  className="w-full h-full object-cover"
                  src={
                    user?.avatarUrl ||
                    avatarPreview ||
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
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Full Name</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                type="text"
                value={user?.userName ?? ""}
                onChange={(e) => {
                  setUser((prevuser) => {
                    if (!prevuser) return prevuser; // hoặc return null

                    return {
                      ...prevuser,
                      userName: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Email Address</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                type="email"
                value={user?.email ?? ""}
                onChange={(e) => {
                  setUser((prevuser) => {
                    if (!prevuser) return prevuser; // hoặc return null

                    return {
                      ...prevuser,
                      email: e.target.value,
                    };
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Phone Number</label>
              <div className="flex">
                <input
                  className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                  type="tel"
                  value={user?.phone ?? ""}
                  onChange={(e) => {
                    setUser((prevuser) => {
                      if (!prevuser) return prevuser; // hoặc return null

                      return {
                        ...prevuser,
                        phone: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Date of Birth</label>
              <input
                className="form-input w-full rounded-lg border-[#e7d5cf] dark:border-[#3d2a23] bg-[#fcf9f8] dark:bg-background-dark h-12 px-4 focus:ring-primary focus:border-primary transition-all"
                type="date"
                value={user?.birthDate?.slice(0, 10) ?? ""}
                onChange={(e) => {
                  setUser((prevuser) => {
                    if (!prevuser) return prevuser; // hoặc return null
                    return {
                      ...prevuser,
                      birthDate: e.target.value,
                    };
                  });
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e7d5cf] dark:border-[#3d2a23]">
            <button
              className={`${loading ? "opacity-50 cursor-not-allowed" : ""} px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all`}
              type="submit"
              disabled={loading}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
