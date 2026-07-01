"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export interface AuthUser {
  userId: string;
  username: string;
  email?: string;
  name?: string;
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      setUser({
        userId: current.userId,
        username: current.username,
        email: attributes.email,
        name: attributes.name,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          loadUser();
          break;
        case "signedOut":
          setUser(null);
          setIsLoading(false);
          break;
      }
    });

    return unsubscribe;
  }, [loadUser]);

  return { user, isLoading };
}
