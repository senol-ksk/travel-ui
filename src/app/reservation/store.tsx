import { useContext, createContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

interface CheckoutProps {
  totalPrice: number
}

interface CheckoutStates extends CheckoutProps {
  incrementTotalPrice: (by: number) => void
  decrementTotalPrice: (by: number) => void
  updateTotalPrice: (value: number) => void
}

export type CheckoutStore = ReturnType<typeof createCheckoutStore>

export const createCheckoutStore = (initProps?: Partial<CheckoutProps>) => {
  const DEFAULT_PROPS: CheckoutProps = {
    totalPrice: 0,
  }
  return createStore<CheckoutStates>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    incrementTotalPrice: (by) =>
      set((state) => ({ totalPrice: state.totalPrice + by })),
    decrementTotalPrice: (by) =>
      set((state) => ({ totalPrice: state.totalPrice - by })),
    updateTotalPrice: (value) => set((state) => ({ totalPrice: value })),
  }))
}

export const CheckoutContext = createContext<CheckoutStore | null>(null)

type CheckoutProviderProps = React.PropsWithChildren<CheckoutProps>

export function CheckoutProvider({
  children,
  ...props
}: CheckoutProviderProps) {
  const storeRef = useRef<CheckoutStore>(null)
  if (!storeRef.current) {
    storeRef.current = createCheckoutStore(props)
  }
  return (
    <CheckoutContext.Provider value={storeRef.current}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckoutContext<T>(
  selector: (state: CheckoutStates) => T
): T {
  const store = useContext(CheckoutContext)
  if (!store) throw new Error('Missing CheckoutContext.Provider in the tree')

  return useStore(store, selector)
}
