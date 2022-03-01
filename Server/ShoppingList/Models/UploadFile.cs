using System;
using System.IO;

namespace ShoppingList.Models
{
    static public class UploadFile
    {
        public static void Upload(string path, string base64)
        {
            // המרת הקובץ למערך בייטים
            byte[] fileBytes = Convert.FromBase64String(base64);

            // כתיבת הקובץ לשרת
            File.WriteAllBytes(path, fileBytes);
        }
    }
}
