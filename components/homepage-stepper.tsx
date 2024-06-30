"use client";
import { Button } from "@/components/button";
import { Step, Stepper, useStepper, type StepItem } from "@/components/stepper";
import { Typography } from "./typography";
import { Skeleton } from "./skeleton";
import { useStytch, useStytchSession, useStytchUser } from "@stytch/nextjs";
import { Login } from "./stytch/login";

export const HomepageStepper = () => {
  const stytch = useStytch();
  // Get the Stytch User object.
  const { user } = useStytchUser();
  // Get the Stytch Session object.
  const { session } = useStytchSession();

  const steps: StepItem[] = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
  ];

  // if (status === "loading") {
  //   return <Skeleton className="h-96 w-full md:max-w-2xl" />;
  // }

  console.log({ user, session });

  return (
    <div className="container max-w-xl flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps}>
        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                <h1 className="text-xl">Step {index + 1}</h1>
              </div>
            </Step>
          );
        })}
        <StepperFooter />
      </Stepper>
    </div>
  );
};

const StepperFooter = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
