/**
 * External dependencies.
 */
import { Link as InternalLink, ExternalLink, Info } from 'lucide-react';

/**
 * Internal dependencies.
 */
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import stripAndDecodeHtml from '@/utils/stripeAndDecodehtml';
import Link from 'next/link';

const TooltipCard = ({
  title,
  content,
  link,
  isInternalLink = false,
  pageName = '',
  className = '',
  iconClassName = '',
  iconSize = 14,
  children,
  enableCursorPointer = true,
}: {
  title?: string;
  content: string;
  link?: string;
  isInternalLink?: boolean;
  pageName?: string;
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  children?: React.ReactNode;
  enableCursorPointer?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          enableCursorPointer ? 'cursor-pointer' : 'cursor-not-allowed',
          'opacity-100',
        )}
      >
        {children ? (
          children
        ) : (
          <Info
            size={iconSize}
            className={cn('text-black dark:text-white ms-2', iconClassName)}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <div className={cn('min-w-[180px] max-w-xs p-2 space-y-1 bg-white', className)}>
          {/* Title */}
          {title && (
            <div
              className="font-bold text-base text-gray-900"
              dangerouslySetInnerHTML={{
                __html: stripAndDecodeHtml(title),
              }}
            />
          )}

          {/* Content */}
          <div
            className="text-sm leading-snug"
            dangerouslySetInnerHTML={{
              __html: stripAndDecodeHtml(content),
            }}
          />

          {/* More Info */}
          {link && (
            <div className="text-xs text-gray-500 border-t pt-2 flex items-center gap-1">
              {isInternalLink ? (
                <>
                  <span>Click</span>
                  <Link
                    href={link}
                    className="text-pink-600 underline inline-flex items-center gap-1 font-medium hover:text-pink-800 transition-colors"
                  >
                    <span>here</span>
                    <InternalLink className="inline" size={12} />
                  </Link>
                  <span>to go to the {pageName} page</span>
                </>
              ) : (
                <>
                  <span>Click</span>
                  <Link
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 underline inline-flex items-center gap-1 font-medium hover:text-pink-800 transition-colors"
                  >
                    <span>here</span>
                    <ExternalLink className="inline" size={12} />
                  </Link>
                  <span>for more info</span>
                </>
              )}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipCard;
