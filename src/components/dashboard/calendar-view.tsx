"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { SkeletonCard } from "../ui/skeleton-card";

interface CalendarViewProps {
  userRole: "admin" | "arbitrator" | "legal";
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "hearing" | "deadline" | "meeting";
  caseId: string;
}

export default function CalendarView({ userRole }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Mock calendar events - in a real application, these would be fetched from the database
  const mockEvents: CalendarEvent[] = [
    {
      id: "event-001",
      title: "Preliminary Hearing",
      date: "2023-11-15",
      time: "10:00 AM",
      type: "hearing",
      caseId: "ARB-2023-042",
    },
    {
      id: "event-002",
      title: "Document Submission Deadline",
      date: "2023-11-18",
      time: "11:59 PM",
      type: "deadline",
      caseId: "ARB-2023-039",
    },
    {
      id: "event-003",
      title: "Case Management Conference",
      date: "2023-11-22",
      time: "2:00 PM",
      type: "meeting",
      caseId: "ARB-2023-038",
    },
    {
      id: "event-004",
      title: "Expert Witness Testimony",
      date: "2023-11-25",
      time: "9:30 AM",
      type: "hearing",
      caseId: "ARB-2023-042",
    },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-200 bg-gray-50"
        ></div>,
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const dateString = date.toISOString().split("T")[0];
      const filteredEvents = events.filter(
        (event) => event.date === dateString,
      );

      days.push(
        <div
          key={day}
          className="h-24 border border-gray-200 p-1 overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${date.getDay() === 0 || date.getDay() === 6 ? "text-red-500" : ""}`}
            >
              {day}
            </span>
            {filteredEvents.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                {filteredEvents.length}
              </span>
            )}
          </div>
          <div className="space-y-1 mt-1">
            {filteredEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${event.type === "hearing" ? "bg-purple-100 text-purple-800" : event.type === "deadline" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
              >
                {event.title}
              </div>
            ))}
            {filteredEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{filteredEvents.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        {userRole === "admin" && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {getMonthName(currentMonth)} {getYear(currentMonth)}
              </CardTitle>
              <CardDescription>
                Schedule and manage hearings and deadlines
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
                disabled={isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                disabled={isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size={40} />
              <p className="mt-4 text-sm text-muted-foreground">
                Loading calendar...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-0">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-medium py-2 border-b border-gray-200"
                >
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Upcoming Events</h3>
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        Case #{event.caseId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
