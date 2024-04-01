import { useFormContext } from "react-hook-form";
import { hotelBranches } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const BranchSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("branch");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Branch</h2>
      <div className="grid grid-cols-5 gap-2">
        {hotelBranches.map((branch) => (
          <label
            className={
              typeWatch === branch
                ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={branch}
              {...register("branch", {
                required: "This field is required",
              })}
              className="hidden"
            />
            <span>{branch}</span>
          </label>
        ))}
      </div>
      {errors.branch && (
        <span className="text-red-500 text-sm font-bold">
          {errors.branch.message}
        </span>
      )}
    </div>
  );
};

export default BranchSection;
