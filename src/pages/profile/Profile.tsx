import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Save, Loader } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import InputField from "@/components/TextField";
import PageHeader from "@components/PageHeader";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
} from "@services/ProfileApi";
import { toast } from "react-toastify";
import LoadingSpinner from "@components/LoadingSpinner";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        const data: any = await fetchUserProfile(user.uid);
        if (data) {
          setUserData(data);
          setValue("name", data.name || "");
          setValue("email", data.email || "");
          setValue("role", data.role || "User");
          setValue("phone", data.phone || "");
          setValue("address", data.address || "");
          setValue("age", data.age || "");
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [user, setValue]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.split(" ");
    return words
      .map((word) => word[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.uid) return;

    setUploading(true);
    try {
      const base64String = await uploadProfileImage(user.uid, file);
      setUserData((prev: any) => ({ ...prev, profilePic: base64String }));
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to upload image. Try again!");
    }
    setUploading(false);
  };

  const onSubmit = async (data: any) => {
    if (user?.uid) {
      setSaving(true);
      const success = await updateUserProfile(user.uid, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        age: data.age,
      });

      setSaving(false);
      if (success) {
        toast.success("Profile updated successfully");
        setUserData({ ...userData, ...data });
      } else {
        toast.error("Failed to update profile. Try again!");
      }
    }
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your profile information." />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-4 bg-surface p-6 shadow-lg rounded-xl text-center flex flex-col items-center">
            <div className="relative w-32 h-32">
              {userData?.profilePic ? (
                <img
                  className="w-32 h-32 object-cover rounded-full theme-border shadow-md"
                  src={userData.profilePic}
                  alt="Profile"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-theme text-theme text-4xl font-bold rounded-full theme-border shadow-md">
                  {getInitials(userData?.name || "User")}
                </div>
              )}

              <label
                htmlFor="upload"
                className="absolute bottom-2 right-2 bg-primary p-2 rounded-full cursor-pointer shadow-md"
              >
                {uploading ? (
                  <Loader size={18} className="animate-spin text-theme" />
                ) : (
                  <Camera size={18} className="text-theme" />
                )}
              </label>
              <input
                type="file"
                id="upload"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <h3 className="text-xl font-bold mt-4">
              {userData?.name || "N/A"}
            </h3>
            <p className="text-sm text-secondary">{userData?.email || "N/A"}</p>

            <span className="px-3 mt-2 text-sm rounded-full bg-primary text-theme p-2">
              Role: {userData?.role || "User"}
            </span>

            <div className="mt-4 w-full space-y-2 text-left text-sm text-secondary">
              <div className="flex justify-between">
                <strong>Address:</strong>
                <span>{userData?.address || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <strong>Phone:</strong>
                <span>{userData?.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <strong>Age:</strong>
                <span>{userData?.age || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:col-span-8 bg-surface p-6 shadow-lg rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                id="name"
                type="text"
                placeholder="Full Name"
                register={register}
              />
              <InputField
                id="email"
                type="email"
                placeholder="Email"
                register={register}
                disabled
              />
              <InputField
                id="phone"
                type="text"
                placeholder="Phone Number"
                register={register}
              />
              <InputField
                id="address"
                type="text"
                placeholder="Address"
                register={register}
              />
              <InputField
                id="age"
                type="text"
                placeholder="Age"
                register={register}
              />

              <button
                type="submit"
                className="w-full bg-primary text-theme py-2 rounded-md flex items-center justify-center gap-2 hover:bg-opacity-90"
                disabled={saving}
              >
                {saving ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
