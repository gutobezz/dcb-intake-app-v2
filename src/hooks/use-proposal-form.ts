"use client";

import { useReducer, useCallback } from "react";
import {
  type Proposal,
  type Allowance,
  type PaymentMilestone,
  type AdditionalOwner,
  INITIAL_PROPOSAL,
} from "@/lib/types";

// ── Action types ──

type Action =
  | { type: "SET_FIELD"; field: keyof Proposal; value: unknown }
  | { type: "SET_NESTED"; path: string; value: unknown }
  | { type: "TOGGLE_SCOPE_ITEM"; itemId: string }
  | { type: "ADD_PAYMENT_MILESTONE" }
  | { type: "REMOVE_PAYMENT_MILESTONE"; index: number }
  | { type: "UPDATE_PAYMENT_MILESTONE"; index: number; field: keyof PaymentMilestone; value: string }
  | { type: "ADD_ALLOWANCE" }
  | { type: "REMOVE_ALLOWANCE"; index: number }
  | { type: "UPDATE_ALLOWANCE"; index: number; field: keyof Allowance; value: string }
  | { type: "SET_PROJECT_TYPES"; types: string[] }
  | { type: "TOGGLE_PROJECT_TYPE"; typeId: string }
  | { type: "TOGGLE_PRIORITY"; priority: string }
  | { type: "TOGGLE_SALESPERSON"; name: string }
  | { type: "SET_NOTES_TAGS"; tags: string[] }
  | { type: "ADD_ADDITIONAL_OWNER" }
  | { type: "REMOVE_ADDITIONAL_OWNER"; index: number }
  | { type: "UPDATE_ADDITIONAL_OWNER"; index: number; field: keyof AdditionalOwner; value: string }
  | { type: "LOAD_PROPOSAL"; data: Partial<Proposal> }
  | { type: "RESET" };

// ── Reducer ──

function proposalReducer(state: Proposal, action: Action): Proposal {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_NESTED": {
      const parts = action.path.split(".");
      if (parts.length === 2) {
        const [obj, key] = parts;
        const current = state[obj as keyof Proposal];
        if (typeof current === "object" && current !== null && !Array.isArray(current)) {
          return {
            ...state,
            [obj]: { ...(current as Record<string, unknown>), [key]: action.value },
          };
        }
      }
      return state;
    }

    case "TOGGLE_SCOPE_ITEM": {
      const current = state.scopeItems[action.itemId] ?? false;
      return {
        ...state,
        scopeItems: { ...state.scopeItems, [action.itemId]: !current },
      };
    }

    case "ADD_PAYMENT_MILESTONE":
      return {
        ...state,
        paymentSchedule: [
          ...state.paymentSchedule,
          { milestone: "", amount: "", percentage: "" },
        ],
      };

    case "REMOVE_PAYMENT_MILESTONE":
      return {
        ...state,
        paymentSchedule: state.paymentSchedule.filter((_, i) => i !== action.index),
      };

    case "UPDATE_PAYMENT_MILESTONE": {
      const schedule = [...state.paymentSchedule];
      schedule[action.index] = {
        ...schedule[action.index],
        [action.field]: action.value,
      };
      return { ...state, paymentSchedule: schedule };
    }

    case "ADD_ALLOWANCE":
      return {
        ...state,
        allowances: [...state.allowances, { description: "", amount: "" }],
      };

    case "REMOVE_ALLOWANCE":
      return {
        ...state,
        allowances: state.allowances.filter((_, i) => i !== action.index),
      };

    case "UPDATE_ALLOWANCE": {
      const allowances = [...state.allowances];
      allowances[action.index] = {
        ...allowances[action.index],
        [action.field]: action.value,
      };
      return { ...state, allowances };
    }

    case "SET_PROJECT_TYPES":
      return { ...state, projectTypes: action.types };

    case "TOGGLE_PROJECT_TYPE": {
      const exists = state.projectTypes.includes(action.typeId);
      const projectTypes = exists
        ? state.projectTypes.filter((t) => t !== action.typeId)
        : [...state.projectTypes, action.typeId];

      // If removing a project type, also remove its scope items
      if (exists) {
        const newScopeItems = { ...state.scopeItems };
        for (const key of Object.keys(newScopeItems)) {
          if (key.startsWith(`${action.typeId}::`)) {
            delete newScopeItems[key];
          }
        }
        return { ...state, projectTypes, scopeItems: newScopeItems };
      }

      return { ...state, projectTypes };
    }

    case "TOGGLE_PRIORITY": {
      const exists = state.priorities.includes(action.priority);
      return {
        ...state,
        priorities: exists
          ? state.priorities.filter((p) => p !== action.priority)
          : [...state.priorities, action.priority],
      };
    }

    case "TOGGLE_SALESPERSON": {
      const exists = state.salespersons.includes(action.name);
      return {
        ...state,
        salespersons: exists
          ? state.salespersons.filter((s) => s !== action.name)
          : [...state.salespersons, action.name],
      };
    }

    case "SET_NOTES_TAGS":
      return { ...state, notesTags: action.tags };

    case "ADD_ADDITIONAL_OWNER":
      return {
        ...state,
        additionalOwners: [
          ...state.additionalOwners,
          { firstName: "", lastName: "", email: "", phone: "", relationship: "" },
        ],
      };

    case "REMOVE_ADDITIONAL_OWNER":
      return {
        ...state,
        additionalOwners: state.additionalOwners.filter((_, i) => i !== action.index),
      };

    case "UPDATE_ADDITIONAL_OWNER": {
      const owners = [...state.additionalOwners];
      owners[action.index] = { ...owners[action.index], [action.field]: action.value };
      return { ...state, additionalOwners: owners };
    }

    case "LOAD_PROPOSAL":
      return { ...INITIAL_PROPOSAL, ...action.data };

    case "RESET":
      return { ...INITIAL_PROPOSAL };

    default:
      return state;
  }
}

// ── Hook ──

export function useProposalForm(initialData?: Partial<Proposal>) {
  const initial: Proposal = initialData
    ? { ...INITIAL_PROPOSAL, ...initialData }
    : { ...INITIAL_PROPOSAL };

  const [state, dispatch] = useReducer(proposalReducer, initial);

  const setField = useCallback(
    (field: keyof Proposal, value: unknown) =>
      dispatch({ type: "SET_FIELD", field, value }),
    []
  );

  const setNested = useCallback(
    (path: string, value: unknown) =>
      dispatch({ type: "SET_NESTED", path, value }),
    []
  );

  const toggleScopeItem = useCallback(
    (itemId: string) => dispatch({ type: "TOGGLE_SCOPE_ITEM", itemId }),
    []
  );

  const toggleProjectType = useCallback(
    (typeId: string) => dispatch({ type: "TOGGLE_PROJECT_TYPE", typeId }),
    []
  );

  const togglePriority = useCallback(
    (priority: string) => dispatch({ type: "TOGGLE_PRIORITY", priority }),
    []
  );

  const toggleSalesperson = useCallback(
    (name: string) => dispatch({ type: "TOGGLE_SALESPERSON", name }),
    []
  );

  const addAdditionalOwner = useCallback(
    () => dispatch({ type: "ADD_ADDITIONAL_OWNER" }),
    []
  );

  const removeAdditionalOwner = useCallback(
    (index: number) => dispatch({ type: "REMOVE_ADDITIONAL_OWNER", index }),
    []
  );

  const updateAdditionalOwner = useCallback(
    (index: number, field: keyof AdditionalOwner, value: string) =>
      dispatch({ type: "UPDATE_ADDITIONAL_OWNER", index, field, value }),
    []
  );

  return {
    state,
    dispatch,
    setField,
    setNested,
    toggleScopeItem,
    toggleProjectType,
    togglePriority,
    toggleSalesperson,
    addAdditionalOwner,
    removeAdditionalOwner,
    updateAdditionalOwner,
  };
}

export type ProposalFormReturn = ReturnType<typeof useProposalForm>;
