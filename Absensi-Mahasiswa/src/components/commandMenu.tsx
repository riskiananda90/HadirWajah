import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/ui/command";
import {
  Home,
  Camera,
  BookOpen,
  Clock,
  Settings,
  Search,
  User,
  LogOut,
  CheckCircle,
} from "lucide-react";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Register keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      {/* Enhanced Search Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-between rounded-lg text-sm font-medium 
                   transition-all duration-200 ease-in-out focus-visible:outline-none 
                   focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 
                   bg-white shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300
                   h-10 px-4 py-2 relative w-full md:w-64 lg:w-96 group"
      >
        <div className="flex items-center">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-600 group-hover:text-gray-900">
            Cari sesuatu disini
          </span>
        </div>
        <kbd
          className="hidden md:flex items-center rounded border border-gray-200 bg-gray-50 
                       px-1.5 py-0.5 text-xs font-medium text-gray-500 gap-0.5"
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Enhanced Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Cari di sini"
          className="border-b border-gray-100 py-3 text-base"
        />
        <CommandList className="py-2">
          <CommandEmpty className="py-6 text-center text-gray-500">
            Pencarian tidak ditemukan
          </CommandEmpty>

          <CommandGroup heading="Navigation" className="px-1">
            <CommandItem
              onSelect={() => runCommand(() => navigate("/dashboard"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-blue-50 aria-selected:bg-blue-50 text-gray-700"
            >
              <Home className="mr-3 h-5 w-5 text-blue-500" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate("/attendance/1"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-green-50 aria-selected:bg-green-50 text-gray-700"
            >
              <Camera className="mr-3 h-5 w-5 text-green-500" />
              <span>Attendance</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate("/courses"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-purple-50 aria-selected:bg-purple-50 text-gray-700"
            >
              <BookOpen className="mr-3 h-5 w-5 text-purple-500" />
              <span>Courses</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate("/history"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-amber-50 aria-selected:bg-amber-50 text-gray-700"
            >
              <Clock className="mr-3 h-5 w-5 text-amber-500" />
              <span>History</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-2 h-px bg-gray-100" />

          <CommandGroup heading="Actions" className="px-1">
            <CommandItem
              onSelect={() => runCommand(() => navigate("/attendance/1"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-teal-50 aria-selected:bg-teal-50 text-gray-700"
            >
              <CheckCircle className="mr-3 h-5 w-5 text-teal-500" />
              <span>Mark Attendance</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => console.log("Profile"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-indigo-50 aria-selected:bg-indigo-50 text-gray-700"
            >
              <User className="mr-3 h-5 w-5 text-indigo-500" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => navigate("/settings"))}
              className="flex items-center rounded-md px-2 py-2 hover:bg-slate-50 aria-selected:bg-slate-50 text-gray-700"
            >
              <Settings className="mr-3 h-5 w-5 text-slate-500" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  localStorage.removeItem("user");
                  navigate("/");
                })
              }
              className="flex items-center rounded-md px-2 py-2 hover:bg-red-50 aria-selected:bg-red-50 text-gray-700"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              <span>Logout</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CommandMenu;
