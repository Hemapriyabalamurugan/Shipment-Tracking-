
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "@/lib/websocket";
import { queryKeys } from "@/lib/query-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then((user) => {
        if (active)
          setState({
            user,
            loading: false,
            error: null,
          });
      })
      .catch(() => {
        if (active)
          setState({
            user: null,
            loading: false,
            error: null,
          });
      });
    
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!state.user) return;

   
connectNotificationSocket(state.user.id, () => {
  

  // Refresh notifications
  queryClient.invalidateQueries({
    queryKey: queryKeys.notifications,
  });

  // Refresh shipment list
  queryClient.invalidateQueries({
    queryKey: queryKeys.shipments,
  });

  // Refresh current customer's shipment list
  queryClient.invalidateQueries({
    queryKey: queryKeys.myShipments(state.user.id),
  });
});
    return () => {
      disconnectNotificationSocket();
    };
  }, [state.user, queryClient]);

  const login = useCallback(async (email, role) => {
    setState((s) => ({
      ...s,
      loading: true,
      error: null,
    }));
    try {
      const { user } = await authApi.login(email, role);
      setState({
        user,
        loading: false,
        error: null,
      });
    } catch (e) {
      setState({
        user: null,
        loading: false,
        error: e.message,
      });
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setState({
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const updated = await authApi.updateProfile(updates);
    setState((s) => ({
      ...s,
      user: updated,
    }));
  }, []);
  
  const refreshUser = useCallback(async () => {
    const user = await authApi.me();

    setState({
      user,
      loading: false,
      error: null,
    });

    return user;
  }, []);
 

  const hasRole = useCallback(
    (...roles) => (state.user ? roles.includes(state.user.role) : false),
    [state.user],
  );

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateProfile,
      refreshUser,
      hasRole,
    }),
    [state, login, logout, updateProfile, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}