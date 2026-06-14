import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type TemplatesModalContextType = {
  isTemplatesModalOpen: boolean;
  setIsTemplatesModalOpen: (
    value: boolean
  ) => void;
};

const TemplatesModalContext =
  createContext<TemplatesModalContextType | null>(
    null
  );

export const TemplatesModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [
    isTemplatesModalOpen,
    setIsTemplatesModalOpen,
  ] = useState(false);

  return (
    <TemplatesModalContext.Provider
      value={{
        isTemplatesModalOpen,
        setIsTemplatesModalOpen,
      }}
    >
      {children}
    </TemplatesModalContext.Provider>
  );
};

export const useTemplatesModal = () => {
  const context = useContext(
    TemplatesModalContext
  );

  if (!context) {
    throw new Error(
      "useTemplatesModal must be used within TemplatesModalProvider"
    );
  }

  return context;
};