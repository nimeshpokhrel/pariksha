"use client";

import React, { useEffect, useState } from "react";
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import Select from "react-select";
import {
  locations,
  districtOptions,
  ktmOptions,
  lalitpurOptions,
  bhaktapurOptions,
  groupStyles,
  groupBadgeStyles,
} from "./data";
import { useAuth } from "@/utils/AuthContext";
import { useForm } from "react-hook-form";
import Input from "../Input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { addCollegeRecommend } from "@/hooks/collegeRecommend";
import useToast from "@/utils/useToast";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { FaUniversity } from "react-icons/fa";
import { sendOtp } from "@/hooks/auth";

const recommendSchema = z.object({
  contactNumber: z
    .string()
    .trim()
    .refine((value) => /^98\d{8}$/.test(value) || /^97\d{8}$/.test(value), {
      message: "Invalid Phone Number.",
    }),
  otp: z.string().trim().length(6, "OTP must be 6 digits long."),
  email: z.string().trim().email("Invalid email address."),
  name: z.string().min(2, "Full name must be at least 2 characters long."),
  rank: z.coerce.number().min(1, "Please provide your rank"),
  coursePreference: z.string().min(2, "Please provide your course preference"),
  desiredCollege: z.string().min(2, "Please provide your desired college"),
});

export default function RecommendationForm() {
  const { showToastError, showToastSuccess } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recommendSchema),
  });

  const { mutate: collegeRecommendAdd } = useMutation({
    mutationFn: (data) => addCollegeRecommend(data),
    onSuccess: () => {
      onOpen();
    },
    onError: (error) => showToastError(error),
  });

  const [personalVehicle, setPersonalVehicle] = useState(false);
  const [publicTransport, setPublicTransport] = useState(false);
  const [nonCredit, setNonCredit] = useState(false);
  const [extracurricular, setExtracurricular] = useState(false);
  const [sliderValue, setSliderValue] = useState([700000, 900000]);
  const [location, setLocation] = useState(null);
  const [district, setDistrict] = useState(null);
  const [area, setArea] = useState(null);
  const [reputationValue, setReputationValue] = useState(5);
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, userPending } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [districtError, setDistrictError] = useState(false);
  const [areaError, setAreaError] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const sendUserOtp = useMutation({
    mutationFn: (number) => sendOtp(number),
    onError: (error) => {
      showToastError(error);
    },
    onSuccess: () => {
      showToastSuccess({
        description: "OTP sent to your contact number",
      });
      setOtpSent(true);
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.fullName);
      setValue("email", user.email);
      setValue("contactNumber", `${user.contactNumber}`);
    }
  }, [user]);

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );
  const onSubmit = (data, event) => {
    event.preventDefault();
    if (!location) {
      setLocationError(true);
      return;
    }
    if (location === "ktm-valley") {
      if (!district) {
        setDistrictError(true);
        return;
      }
      if (district !== "any" && !area) {
        setAreaError(true);
        return;
      }
    }
    const formData = {
      ...data,
      location,
      ktmDistrict: district,
      ktmArea: area,
      reputationRequired: reputationValue,
      fees: sliderValue,
      personalVehicle,
      publicTransport,
      nonCredit,
      extracurricular,
    };
    collegeRecommendAdd(formData);
  };

  return (
    <div className="min-h-screen">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isClosable={false}
      >
        <ModalOverlay />
        <ModalContent marginX={4}>
          <ModalBody>
            <div className="relative w-full">
              <Link href={"/"}>
                <div className="absolute -right-10 top-0 z-[9999] mt-[-24px] flex h-[36px] w-[36px] items-center justify-center rounded-full bg-primary text-white">
                  <IoMdClose size={20} />
                </div>
              </Link>
            </div>
            <Link
              href={"/"}
              className="mb-4 mt-4 flex w-max items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-white"
            >
              <IoMdArrowBack />
              Home
            </Link>
            <div className="flex flex-col items-center gap-4">
              <Image
                src={"/rightIcon.svg"}
                alt="success"
                width={40}
                height={20}
              />
              <p className="text-center text-sm text-gray-600">
                Your college recommendation request has been successfully
                received. You will receive an email with the details soon.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <Link
                href={"https://pariksha.solutions/government-colleges/"}
                target="_blank"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white"
              >
                <FaUniversity />
                Government Colleges
              </Link>
              <Link
                href={"https://pariksha.solutions/partner-colleges/"}
                target="_blank"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white"
              >
                <FaUniversity />
                Partner Colleges
              </Link>
            </div>
            <div className="mb-4 mt-8">
              <p className="text-center text-sm text-gray-600">
                If you need any help selecting a college or to secure a
                scholarship feel free to contact us.
              </p>
              <div className="mt-4 flex items-center justify-center gap-8">
                <Link href={"https://wa.me/9779761846971"} target="_blank">
                  <Image
                    src={"/images/iconsSocial/whatsapp.png"}
                    alt="whatsapp"
                    width={40}
                    height={40}
                  />
                </Link>
                <Link
                  href={
                    "https://www.facebook.com/profile.php?id=61562161082077"
                  }
                  target="_blank"
                >
                  <Image
                    src={"/images/iconsSocial/facebook.png"}
                    alt="whatsapp"
                    width={40}
                    height={40}
                  />
                </Link>
                <Link href={"mailto:info@pariksha.solutions"} target="_blank">
                  <Image
                    src={"/images/iconsSocial/gmail.png"}
                    alt="whatsapp"
                    width={40}
                    height={40}
                  />
                </Link>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="m-auto flex h-full w-full max-w-[550px] flex-col justify-between rounded-lg border-2 border-gray-200 bg-white py-8">
        <p className="text-md mb-8 border-b-2 border-gray-300 px-8 pb-4 text-gray-900">
          Please complete this form to receive personalized college
          recommendations based on your individual preferences and needs.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8">
          <div
            className={` ${userPending === false && !user ? "block" : "hidden"}`}
          >
            <Input
              register={register}
              name="name"
              label="Full Name"
              error={errors.name}
            />
            <Input
              register={register}
              name="email"
              label="Email"
              error={errors.email}
            />
            <Input
              register={register}
              name="contactNumber"
              label="Contact Number"
              error={errors.contactNumber}
              rightButton={"Send OTP"}
              rightButtonOnClick={() => {
                sendUserOtp.mutate(
                  document.getElementById("contactNumber").value
                );
              }}
            />
            {otpSent && (
              <Input
                register={register}
                name={"otp"}
                label="OTP (sent to your contact number)"
                error={errors.otp}
              />
            )}
          </div>
          <Input
            register={register}
            name="rank"
            label="Rank In Entrance"
            type={"number"}
            error={errors.rank}
          />
          <Input
            register={register}
            name="coursePreference"
            label="Course Preference"
            type={"text"}
            error={errors.coursePreference}
          />
          <Input
            register={register}
            name="desiredCollege"
            label="Desired College"
            type={"text"}
            error={errors.desiredCollege}
          />

          <div className="w-full">
            <p className="mb-2 text-sm text-gray-500">
              Preferred College Fees*
            </p>

            <div className="flex items-center justify-between text-xs">
              <p>Rs. 5,00,000 </p>
              <p>Rs. 20,00,000 </p>
            </div>
            <div className="mx-4">
              <RangeSlider
                aria-label={["min", "max"]}
                defaultValue={[700000, 900000]}
                min={500000}
                max={2000000}
                step={100000}
                onChange={(val) => setSliderValue(val)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </div>
            <div className="mb-8 text-center">
              <span className="border-2 px-2 py-0.5 text-xs">
                Rs. {sliderValue[0]} - {sliderValue[1]}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 pl-2 text-sm text-gray-500">
              How much does the reputation of the college matters to you?
            </p>
            <Slider
              aria-label="slider-ex-1"
              defaultValue={5}
              min={0}
              max={10}
              step={1}
              onChange={(v) => setReputationValue(v)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="mt-4">
                <SliderMark value={0} fontSize="sm">
                  0
                </SliderMark>
                <SliderMark value={5} fontSize="sm">
                  5
                </SliderMark>
                <SliderMark value={10} fontSize="sm">
                  10
                </SliderMark>
              </div>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={reputationValue}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          </div>
          <div className="area-selection mb-6 mt-6">
            <p className="mb-1 pl-2 text-sm text-gray-500">
              Residence / Study Location*
            </p>
            <div>
              <Select
                closeMenuOnSelect={true}
                options={locations}
                placeholder="Select Study Location"
                onChange={(val) => {
                  setLocationError(false);
                  setDistrictError(false);
                  setDistrict(null);
                  setArea(null);
                  setLocation(val.value);
                }}
                className={`${locationError && "rounded border-2 border-solid border-red-500"}`}
              />
            </div>
            {location === "ktm-valley" && (
              <div className="mt-2">
                <p className="mb-1 pl-2 text-sm text-gray-500">District*</p>
                <Select
                  closeMenuOnSelect={true}
                  options={districtOptions}
                  onChange={(val) => {
                    setDistrictError(false);
                    setArea(null);
                    setAreaError(false);
                    setDistrict(val.value);
                  }}
                  className={`${districtError && "rounded border-2 border-solid border-red-500"}`}
                />
              </div>
            )}
            {location === "ktm-valley" && district && (
              <div className="mt-2">
                <p className="mb-1 pl-2 text-sm text-gray-500">Area*</p>
                {district === "kathmandu" && (
                  <Select
                    closeMenuOnSelect={true}
                    options={ktmOptions}
                    formatGroupLabel={formatGroupLabel}
                    onChange={(val) => {
                      setAreaError(false);
                      setArea(val.value);
                    }}
                    className={`${areaError && "rounded border-2 border-solid border-red-500"}`}
                  />
                )}
                {district === "bhaktapur" && (
                  <Select
                    closeMenuOnSelect={true}
                    options={bhaktapurOptions}
                    onChange={(val) => {
                      setAreaError(false);
                      setArea(val.value);
                    }}
                    className={`${areaError && "rounded border-2 border-solid border-red-500"}`}
                  />
                )}
                {district === "lalitpur" && (
                  <Select
                    closeMenuOnSelect={true}
                    options={lalitpurOptions}
                    formatGroupLabel={formatGroupLabel}
                    onChange={(val) => {
                      setAreaError(false);
                      setArea(val.value);
                    }}
                    className={`${areaError && "rounded border-2 border-solid border-red-500"}`}
                  />
                )}
              </div>
            )}

            <p className="mb-2 mt-2 pl-2 text-xs text-gray-500">
              Please select accordingly to find the most convinient college for
              you.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Checkbox
              colorScheme="green"
              isChecked={personalVehicle}
              onChange={(event) => setPersonalVehicle(event.target.checked)}
            >
              <span className="ml-1 text-sm">
                I have a personal vehicle to go to college.
              </span>
            </Checkbox>
            <Checkbox
              colorScheme="green"
              isChecked={publicTransport}
              onChange={(event) => setPublicTransport(event.target.checked)}
            >
              <span className="ml-1 text-sm">
                I am willing to take public bus to college.
              </span>
            </Checkbox>
            <Checkbox
              colorScheme="green"
              isChecked={nonCredit}
              onChange={(event) => setNonCredit(event.target.checked)}
            >
              <span className="ml-1 text-sm">
                Non-credit technical courses matters to me.
              </span>
            </Checkbox>
            <Checkbox
              colorScheme="green"
              isChecked={extracurricular}
              onChange={(event) => setExtracurricular(event.target.checked)}
            >
              <span className="ml-1 text-sm">
                Extracurricular activities matters to me.
              </span>
            </Checkbox>
          </div>

          <input
            type="submit"
            value="Get Your Recommendations"
            className="mt-6 w-full cursor-pointer rounded-full bg-primary px-8 py-3 text-white hover:bg-opacity-95"
          />
        </form>
      </div>
    </div>
  );
}
