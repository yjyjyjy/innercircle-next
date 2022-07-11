import React, { useContext, createContext, useReducer } from 'react'

// initial state
const initialContext = {
   authUserProfile: {},
   // setAuthUserProfile: state => ({ ...state,  }),
   setAuthUserProfile: () => { }
}

const appReducer = (state, { type, payload }) => {
   switch (type) {
      case 'SET_AUTH_USER_PROFILE':
         return {
            ...state,
            setAuthUserProfile: payload,
         }
      default:
         return state
   }
}

const AppContext = createContext(initialContext)
export const useAppContext = () => useContext(AppContext)
const AppContextProvider = ({ children }) => {
   const [store, dispatch] = useReducer(appReducer, initialContext)

   const contextValue = {
      authUserProfile: store.authUserProfile,
      setAuthUserProfile: (authUserProfile) => {
         dispatch({ type: 'SET_AUTH_USER_PROFILE', payload: authUserProfile })
      },
   }

   return (
      <AppContext.Provider value={contextValue}>
         {children}
      </AppContext.Provider>
   )
}

export default AppContextProvider

